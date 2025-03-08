import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join a room (e.g., a chat room with userId 1 and userId 2)
const room = '1-2';
socket.emit('joinRoom', room);

// Listen for incoming messages
socket.on('receiveMessage', (message) => {
    console.log('New message received:', message);
});

// Send a message
function sendMessage(senderId, recipientId, message) {
    const data = { senderId, recipientId, message };
    socket.emit('sendMessage', data);
}

// Listen for typing indicator
socket.on('typing', (data) => {
    console.log(`${data.senderId} is typing...`);
});

// Send typing indicator
function notifyTyping(recipientId) {
    socket.emit('typing', { recipientId });
}
