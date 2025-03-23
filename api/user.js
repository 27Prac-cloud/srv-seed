const express = require('express');
const router = express.Router();

// Middleware to parse JSON request body
router.use(express.json());

// User signup route
router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Placeholder response - in a real app, you would hash the password and store user data in a database
    res.status(201).json({ message: 'User registered successfully', user: { username, email } });
});

module.exports = router;
