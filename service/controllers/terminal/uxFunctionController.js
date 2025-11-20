const db = require('../../config/db');

exports.index = async (req, res) => {
   
    try { 
        const [menu] = await db.query(
            `Select  pos2sorting as 'order', name,  pos2Class as 'class' 
            from ux 
            where pos2Status = 1
            order by pos2Sorting ASC`,
        );

        const data = {
            menu: menu,
        }

        res.json(data);
    } catch (err) {
        console.error('Error saving log:', err);
        res.status(500).json({ status: 'error', message: 'Failed to save log' });
    }

};