import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const query = 'SELECT email,activeuser,username FROM users WHERE email != ?';
        const params = [email];

        const [results] = await req.db.execute(query, params);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;
