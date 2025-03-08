import express from 'express';
import generateToken from '../jwt/generateToken.js';  

const router = express.Router();

router.post('/', async (req, res) => {

    const { emailOrPhone, password } = req.body;

    console.log(emailOrPhone, password);

    if (!emailOrPhone || !password) {
        return res.status(400).json({ error: 'Email/Phone and Password are required' });
    }

    try {
        const query = 'SELECT * FROM users WHERE email = ? OR phone = ?';
        const [users] = await req.db.execute(query, [emailOrPhone, emailOrPhone]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                phone: user.phone,
                username: user.username,
                roleType: user.roleType,
            },
            token,
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

export default router;
