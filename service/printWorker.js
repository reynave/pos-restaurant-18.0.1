require('dotenv').config();
const { io } = require('socket.io-client');
const pool = require('./config/db');
const { sendToPrinter, sendToPrinterDummy } = require('./helpers/printer');



const fs = require('fs');
const path = require('path');

const Handlebars = require("handlebars");
require("./helpers/handlebarsFunction")(Handlebars);



const socket = io(process.env.LOCALHOST);
socket.emit('message-from-client', 'PrinterWorker Active message-from-client');

async function processQueue() {
  console.log("WAITING", new Date())
  const db = await pool.getConnection();
  try {
    await db.beginTransaction();

    // Ambil 1 data status = 0 (PENDING)
    const [rows] = await db.query(
      `SELECT 
            q.*, p.printerTypeCon, p.ipAddress, p.port , q.message, q.rushPrinting
        FROM print_queue AS q
        LEFT JOIN printer AS p ON p.id = q.printerId
      WHERE q.status = 0  ORDER BY q.id DESC LIMIT 1 FOR UPDATE`
    );
      let consoleError = rows[0] ? rows[0].consoleError : '';

    if (rows.length === 0) {
      await db.rollback(); // tetap rollback meski tidak ada data (safe exit)
      db.release();
      return;
    }

    const task = rows[0];

    // Update ke status = 1 (PRINTING)
    await db.query(`UPDATE print_queue SET status = 1 WHERE id = ?`, [task.id]);

    await db.commit(); // penting! simpan perubahan status
    db.release();      // kembalikan koneksi ke pool
    rows[0].message = JSON.parse(rows[0].message);
    const dataToPrint =  rows[0].message;  
    dataToPrint['rushPrinting'] = rows[0]['rushPrinting'];


    console.log(dataToPrint)
   
    const data = {
      id: task.id,
      status: 1,
      statusName: "PRINTING",
      consoleError: ''
    }
    socket.emit('printing-reload', data);

    try {
      // Proses cetak
      const templatePath = path.join(__dirname, './public/template/kitchen.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      const result = {
        port : rows[0].port,
        ipAddress : rows[0].ipAddress,
        message : template(dataToPrint),
      };
      
      
      console.log("Await sendToPrinter(dataToPrint)",result)
      await sendToPrinter(result);

      const data = {
        id: task.id,
        status: 2,
        statusName: "DONE",
        consoleError: ''
      }
      socket.emit('printing-reload', data);
      // Update status jadi 2 (DONE)
      await pool.query(`UPDATE print_queue SET status = 2 WHERE id = ?`, [task.id]);
    } catch (printErr) {
      console.error('❌ Gagal print:', printErr.message);
      const data = {
        id: task.id,
        status: -1,
        statusName: "FAILED",
        consoleError: printErr.message
      }
      socket.emit('printing-reload', data);
      // Update status jadi -1 (FAILED)
      await pool.query(`UPDATE print_queue  SET 
        status = -1 , consoleError = '${consoleError+'; \n '+printErr.message}'
        WHERE id = ${task.id}`);
    }

  } catch (err) {
    await db.rollback();
    db.release();
    console.error('❌ Error saat proses queue:', err.message);
  }
}

async function processQueue2() {
  console.log("WAITING", new Date())
  const db = await pool.getConnection();
  try {
    await db.beginTransaction();

    // Ambil 1 data status = 0 (PENDING)
    const [rows] = await db.query(
      `SELECT 
            q.*, p.printerTypeCon, p.ipAddress, p.port , q.message, q.rushPrinting
        FROM print_queue AS q
        LEFT JOIN printer AS p ON p.id = q.printerId2
      WHERE q.status = -1 AND  q.status2 = 0 ORDER BY q.id DESC LIMIT 1 FOR UPDATE`
    );
    let consoleError = rows[0] ? rows[0].consoleError : '';

    if (rows.length === 0) {
      await db.rollback(); // tetap rollback meski tidak ada data (safe exit)
      db.release();
      return;
    }

    const task = rows[0];

    // Update ke status = 1 (PRINTING)
    await db.query(`UPDATE print_queue SET status2 = 1 WHERE id = ?`, [task.id]);

    await db.commit(); // penting! simpan perubahan status
    db.release();      // kembalikan koneksi ke pool
    rows[0].message = JSON.parse(rows[0].message);
    const dataToPrint =  rows[0].message;  
    dataToPrint['rushPrinting'] = rows[0]['rushPrinting'];


    console.log(dataToPrint)
   
    const data = {
      id: task.id,
      status: 1,
      statusName: "PRINTING",
      consoleError: ''
    }
    socket.emit('printing-reload', data);

    try {
      // Proses cetak
      const templatePath = path.join(__dirname, './public/template/kitchen.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      const result = {
        port : rows[0].port,
        ipAddress : rows[0].ipAddress,
        message : template(dataToPrint),
      };
      
      
      console.log("Await sendToPrinter(dataToPrint)",result)
      await sendToPrinter(result);

      const data = {
        id: task.id,
        status: 2,
        statusName: "DONE",
        consoleError: ''
      }
      socket.emit('printing-reload', data);
      // Update status jadi 2 (DONE)
      await pool.query(`UPDATE print_queue SET status2 = 2 WHERE id = ?`, [task.id]);
    } catch (printErr) {
      console.error('❌ Gagal print:', printErr.message);
      const data = {
        id: task.id,
        status: -1,
        statusName: "FAILED",
        consoleError: printErr.message
      }
      socket.emit('printing-reload', data);
      // Update status2 jadi -1 (FAILED)



      await pool.query(`UPDATE print_queue  SET 
        status2 = -1 , consoleError = '${consoleError+'; \n '+printErr.message}'
        WHERE id = ${task.id}`);
    }

  } catch (err) {
    await db.rollback();
    db.release();
    console.error('❌ Error saat proses queue:', err.message);
  }
}

// Jalankan tiap 1 detik
setInterval(processQueue, 1000);
setInterval(processQueue2, 1000);


