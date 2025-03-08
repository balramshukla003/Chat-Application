import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './sql_query/ConnectDB.js';
import registerRoute from './routes/registerRoute.js';
import loginRoute from './routes/loginRoute.js';
import protectedRoute from './routes/protectedRoute.js';
import chatRoute from './routes/chatRoute.js';
import allUser from './routes/allUser.js';

dotenv.config();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// Set __dirname for ES6
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.db = connectDB;
    next();
});

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/protected', protectedRoute);
app.use('/api/chat', chatRoute);
app.use('/api/alluser', allUser);

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', (data) => {
        io.to(data.recipientId).emit('receiveMessage', data);
    });

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('typing', (data) => {
        socket.to(data.recipientId).emit('typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}/`);
});
