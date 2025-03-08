import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(
            {
                email: user.email,
                phone: user.phone,
                name: user.username
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPIRATION }
        );

        if (!token) {
            return reject('Error generating token');
        }
        resolve(token);
    });
};

export default generateToken;
