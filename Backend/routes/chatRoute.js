import { Router } from 'express';

const router = Router();

// Fetch chat history
router.get('/messages/:senderId/:recipientId', async (req, res) => {
    const { senderId, recipientId } = req.params;

    try {
        const [messages] = await req.db.execute(
            `SELECT * FROM messages 
             WHERE (sender_id = ? AND recipient_id = ?) 
             OR (sender_id = ? AND recipient_id = ?) 
             ORDER BY created_at ASC`,
            [senderId, recipientId, recipientId, senderId]
        );
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Save a new message
router.post('/messages', async (req, res) => {
    const { senderId, recipientId, message } = req.body;

    if (!senderId || !recipientId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await req.db.execute(
            `INSERT INTO messages (sender_id, recipient_id, message) 
             VALUES (?, ?, ?)`,
            [senderId, recipientId, message]
        );
        res.status(201).json({ message: 'Message saved', id: result.insertId });
    } catch (error) {
        console.error('Error saving message:', error.message);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

export default router;
