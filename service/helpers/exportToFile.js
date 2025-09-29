const {  formatDateOnly } = require('./global'); 

const fs = require('fs').promises;
const path = require('path');

const Handlebars = require("handlebars");
require("./handlebarsFunction")(Handlebars);

async function csvFile(cartId, sendOrder, printQueue) {
    
    // Buat folder export jika belum ada 
    const dateFolder = formatDateOnly(new Date());
    const exportDir = path.join(__dirname, '../public/output/sendOrder', dateFolder);

    try {
        await fs.mkdir(exportDir, { recursive: true });

        const fileName = `${cartId}.${sendOrder}.csv`;
        const csvFilePath = path.join(exportDir, fileName);

        if (printQueue && printQueue.length > 0) {
            const headers = Object.keys(printQueue[0]);
            const csvRows = [
                headers.join(','), // header
                ...printQueue.map(row =>
                    headers.map(h => (row[h] ?? '').toString().replace(/"/g, '""')).join(',')
                )
            ];
            await fs.writeFile(csvFilePath, csvRows.join('\n'), 'utf8');
        }
    } catch (err) {
        console.error('Export error:', err);
    }
}

async function txtTableChecker(cartId, so, data, transaction) {
    
    const templatePath = path.join(__dirname, '../public/template/tableChecker.hbs');
    try {
           
  
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const result = template({
            cart: data,
            transaction: transaction,
        });
        

        // Buat folder export jika belum ada
        const dateFolder = formatDateOnly(new Date());
        const exportDir = path.join(__dirname, '../public/output/tableChecker', dateFolder);
        await fs.mkdir(exportDir, { recursive: true });

        const fileName = `${cartId}.${so}.txt`;
        //const fileName = `test.txt`;
        const txtFilePath = path.join(exportDir, fileName);

        await fs.writeFile(txtFilePath, result, 'utf8');
    } catch (err) {
        console.error('Render error:', err);
    }
}


module.exports = {
    csvFile,
    txtTableChecker
};
