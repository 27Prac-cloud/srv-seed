const express = require('express');
const router = express.Router();
const database = require('../app/db/database');
const user = require('../app/model/user');
let db = null;
// const mongo_db = new MongoDatabase('mongodb://localhost:27017', 'seed_db');
// mongo_db.connect();
// const userModel = new UserModel(mongo_db);


(async () => {
    // Change this to "mongo" to use MongoDB
    const db_type = "csv";
    db = new database(db_type);

    // Create a user
    await user.create_user({ name: "Alice", email: "alice@example.com", password: "alice" });

    // Find a user
    //const users = await user_model.findUser({ name: "Alice" });
    //console.log("Users Found:", users);

    // Update a user
    //await user_model.updateUser({ name: "Alice" }, { email: "alice@newemail.com" });

    // Delete a user
    //await user_model.deleteUser({ name: "Alice" });

    let jwt_token = await user.sign_in("alice@example.com", "alice");

    await user.do_activity(jwt_token)

    //await db.close();
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
