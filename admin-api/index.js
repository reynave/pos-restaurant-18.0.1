require('dotenv').config();
const express = require('express');
const app = express(); 
const employeeRoutes = require('./routes/employee');
const specialHour = require('./routes/specialHour');
const holidayList = require('./routes/holidayList');
const payment = require('./routes/payment');
const discount = require('./routes/discount');

const fs = require('fs');

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
app.use('/public',express.static('public'));
app.use('/specialHour', specialHour); 
app.use('/holidayList', holidayList); 
app.use('/employee', employeeRoutes);
app.use('/payment', payment);
app.use('/discount', discount);
 
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
