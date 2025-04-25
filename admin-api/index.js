require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employee');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());


app.use('/employee', employeeRoutes);
app.use('/',  (req, res) => {
    const data = {
        error :false,
        serverTime : new Date(),   
    }
    res.json(data);
  
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
