const net = require('net');
const printerIp = '10.51.122.20'; // Ganti dengan IP printer kamu
const printerPort = 9100;
const cutCommand = '\x1B\x69';
const {  today  } = require('./global');

// Fungsi reusable untuk mencetak ke printer ESC/POS via IP
const printToPrinter = (message, printerIp = '10.51.122.20', printerPort = 9100) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const cut = "\x1B\x69"; // ESC i = cut paper (Epson-style)
    client.connect(printerPort, printerIp, () => {
      console.log(`Connected to printer at ${printerIp}:${printerPort}`);
      client.write(message+cut);
      client.end();
    });

    client.on('close', () => {
      resolve('Print success and connection closed');
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
};


async function sendToPrinter(data) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
   // console.log(data);
    const message = data.message; 
  
  //  const jsonMessage = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;
   // console.log("Message:", jsonMessage);

    const printerPort = data.port;
    const printerIp = data.ipAddress;
 

    client.connect(printerPort, printerIp, () => {
      console.log('🖨️  Connected to printer');
      client.write(message);
      client.end();
    });

    client.on('close', () => {
      console.log('✅  Print selesai');
      resolve();
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
}

// Simulasi print
async function sendToPrinterDummy(data) {

  console.log(`🖨️  Printing:`, data);

  // Delay untuk simulasi cetak
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log(`✅  Printed ID :`, data.id || 'unknown');
}

async function printQueueInternal(db, sendOrder, userId) {
   const q1 = `SELECT c.cartId, c.sendOrder,  c.menuId , c.id AS 'cartItemId',    m.descs,   m.printerGroupId,  
        b.tableName, '' as modifier, 1 as qty, a.dailyCheckId
      FROM cart_item AS c
      JOIN cart AS a ON c.cartId = a.id
      LEFT JOIN menu AS m ON m.id = c.menuId 
      LEFT JOIN outlet_table_map AS b ON b.id = a.outletTableMapId
      WHERE c.sendOrder = '${sendOrder}' `;
    const [result] = await db.query(q1);

    let i = 0;
    for (const emp of result) {
      const { cartId, cartItemId, } = emp;

      const q2 = `SELECT  m.descs 
      FROM cart_item_modifier AS c
      LEFT JOIN modifier AS m ON m.id = c.modifierId
      WHERE c.cartId = '${cartId}' AND c.cartItemId = ${cartItemId} AND c.modifierId != 0
        `;

      const [cart_item_modifier] = await db.query(q2);

      let n = 0;
      cart_item_modifier.forEach(element => {
        result[i]['modifier'] += ((n > 0) ? ', ' : '') + element['descs'];
        n++
      });
      i++;
    }

    const items = [];
    for (const row of result) {
      let getIndexById = items.findIndex((obj) => (obj.menuId === row.menuId) && (obj.modifier == row.modifier));

      if (getIndexById > -1) {
        items[getIndexById]['qty'] += 1;
      } else {
        items.push(row);
      }

    }


    for (const row of items) {


      const x1 = `SELECT * FROM printer WHERE printerGroupId = ${row['printerGroupId']} AND presence = 1`;
      const [printerList] = await db.query(x1);

      for (const rexv of printerList) {
        // Format date and time
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const message = {
          tableName: row['tableName'],
          dateTime: today(),
          date: date,
          time: time,
          descs: row['descs'],
          modifier: row['modifier'],
        }

        const q11 = `
            INSERT INTO print_queue (
                dailyCheckId, cartId,  so,
                message,  printerId, status, 
                inputDate, updateDate , menuId,
                inputBy, updateBy
            ) 
          VALUES (
            '${result[0]['dailyCheckId']}', '${row['cartId']}', '${row['sendOrder']}',
            '${JSON.stringify(message)}',  '${rexv['id']}',  0,
            '${today()}', '${today()}', '${row['menuId']}',
            ${userId}, ${userId}
          )`;

        const [rest] = await db.query(q11);
        

      }


    }

  return {
    items: items, 
    // tambahkan data lain jika perlu
  };
}


module.exports = {
  printToPrinter, sendToPrinter, sendToPrinterDummy, printQueueInternal
};