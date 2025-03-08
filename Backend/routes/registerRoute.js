import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, email, phone, roleType, password } = req.body;
    const activeUser = 0;

    if (!email || !password || !username || !phone || !roleType) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
    
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR phone = ?';
        const [existingUser] = await req.db.execute(checkQuery, [email, phone]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User with the same email or phone already exists' });
        }
        
        const query = 'INSERT INTO users (email, phone, roleType, username, activeUser, password) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [email, phone, roleType, username, activeUser, password];

        const [result] = await req.db.execute(query, values);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

export default router;
