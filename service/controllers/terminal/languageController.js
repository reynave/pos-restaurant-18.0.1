const db = require('../../config/db');


exports.getData = async (req, res) => {

    try {
        const [row] = await db.query(`
            SELECT name, lang1, lang2 ,id FROM language ORDER BY name ASC
        `);

        // tolong ubah format jadi "name": "label"
        const en = {};
        row.forEach(item => {
            en[item.name] = item.lang1;
        });

        const id = {};
        row.forEach(item => {
            id[item.name] = item.lang2;
        });


        res.json({
            en: en,
            id: id,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
