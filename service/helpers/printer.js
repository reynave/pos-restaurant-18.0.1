const net = require('net');

// Fungsi reusable untuk mencetak ke printer ESC/POS via IP
const printToPrinter = (message, printerIp = '10.51.122.20', printerPort = 9100) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(printerPort, printerIp, () => {
      console.log(`Connected to printer at ${printerIp}:${printerPort}`);
      client.write(message);
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

module.exports = {
  printToPrinter,
};