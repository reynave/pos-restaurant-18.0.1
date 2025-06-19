const port = 3000;
const express = require('express'); // perbaikan di sini
const app = express();              // pisahkan instance-nya 
const http = require('http').Server(app);

const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Ganti kalau pakai frontend berbeda
    },
});

let user = 0;

  
io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);

    socket.on("data", (arg) => {
        console.log("io.emit", arg);
        io.emit("emiter", arg); // broadcast ke semua client
    });
 
});
 

http.listen(port, () => {
    console.log('listening on *:' + port);
});
