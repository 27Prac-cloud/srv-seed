const express = require('express');
const userRoutes = require('./api/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON request body
app.use(express.json());

// API Routes
app.use('/api', userRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
