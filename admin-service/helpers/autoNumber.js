const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today, formatDateOnly } = require('../helpers/global');


async function autoNumber(name = '') {
    const inputDate = today();

    const [rows] = await db.query(
        `SELECT *
      FROM auto_number  
      WHERE name = '${name}' `
    );
    let prefix = '';

    if (rows[0].prefix == 'yymmdd') {
        const now = new Date();
        const year = String(now.getFullYear()).slice(2); // Ambil 2 digit terakhir tahun
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Bulan dari 0–11
        const day = String(now.getDate()).padStart(2, '0');

        prefix = `${year}${month}${day}`;
    }else{
        prefix = rows[0].prefix;
    }
    const newNumber = rows[0].runningNumber + 1;
    const newValue = prefix + String((newNumber)).padStart(rows[0].digit, '0');

    const [update] = await db.query(`
       UPDATE auto_number SET 
           lastRecord  = '${newValue}',
           runningNumber  = ${newNumber}, 
           updateDate = '${today()}' 
         WHERE name = '${name}'`,);

    return {
        update: update.insertId,
        insertId: newValue,
        items: rows[0],
        //insertId: result.insertId,
        inputDate,
    };
}

module.exports = {
    autoNumber
};