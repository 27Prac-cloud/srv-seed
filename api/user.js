const express = require('express');
const router = express.Router();
const mongo_db = require('../app/db/mongo_db');
const csv_db = require('../app/db/csv_db');
const user_model = require('../app/model/user_model');
// const mongo_db = new MongoDatabase('mongodb://localhost:27017', 'seed_db');
// mongo_db.connect();
// const userModel = new UserModel(mongo_db);


(async () => {
    // Change this to "mongo" to use MongoDB
    const dbType = "csv";

    let db;
    if (dbType === "mongo") {
        db = new mongo_db('mongodb://localhost:27017', 'testDB');
    } else {
        db = new csv_db('users.csv');
    }

    await db.connect();

    const userModel = new user_model(db);

    // Create a user
    await userModel.createUser({ name: "Alice", email: "alice@example.com" });

    // Find a user
    const users = await userModel.findUser({ name: "Alice" });
    console.log("Users Found:", users);

    // Update a user
    await userModel.updateUser({ name: "Alice" }, { email: "alice@newemail.com" });

    // Delete a user
    //await user_model.deleteUser({ name: "Alice" });

    await db.close();
})();



// Middleware to parse JSON request body
router.use(express.json());

// User signup route
router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    userModel.createUser({ name: "Alice", email: "alice@example.com", password: password });

    // Placeholder response - in a real app, you would hash the password and store user data in a database
    res.status(201).json({ message: 'User registered successfully', user: { username, email } });
});

module.exports = router;
