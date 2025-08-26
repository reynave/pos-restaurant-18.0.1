const net = require('net');
const printerIp = '10.51.122.20'; // Ganti dengan IP printer kamu
const printerPort = 9100;
const cutCommand = '\x1B\x69';

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
module.exports = {
  printToPrinter, sendToPrinter, sendToPrinterDummy
};