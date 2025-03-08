import express from "express";
import authenticateToken from '../jwt/verifyTKN.js';

const router = express.Router();
router.post('/', async (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: 'error', message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Access denied. No token Found.' });
        }

        const result = await authenticateToken(token);

        if (!result) {
            return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Token is valid.',
            data: result.data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Server error. Please try again later.',
        });
        console.log(err);
    }

});


export default router;