const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth'); 

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message)
            return res.status(400).json({ msg: 'All fields are required' });

        const newMessage = new Contact({ name, email, message });
        await newMessage.save();
        res.status(201).json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error('Error saving contact message:', err);
        res.status(500).send('Server error');
    }
});

router.get('/', auth('admin'), async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        console.log(messages);
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).send('Server error');
    }
});


router.delete('/:id', auth('admin'), async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Message deleted successfully' });
    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
