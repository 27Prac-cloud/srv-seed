const database = require('../db/database');
const jwt_token = require('../token/jwt_token');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
    constructor({ id, name, email, hashed_password }) {
        this.db = database.get_db_instance();
        this.collection = 'users';

        this.id = id
        this.name = name;
        this.email = email;
        this.hashed_password = hashed_password;
    }

    static async create_user(user_data) {
        console.log("Creating users:", user_data.name, user_data.email, user_data.password);
        let hashed_password = await this.hash_password(user_data.password);
        delete user_data.password;
        user_data.hashed_password = hashed_password;
        user_data.id = uuidv4().replace(/-/g, '');
        let user = new User(user_data);
        await user.create()
    }

    static async hash_password(password) {
        const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Salt:", salt);
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    }

    static async sign_in(email, password) {
        let users_data = await this.find_user({ email: email });
        console.log("User Data:", users_data);
        if (users_data.length === 0) {
            throw new Error("User not found");
        }
        let user = users_data[0];
        await this.verify_password(password, user.hashed_password);
        let jwt = new jwt_token({id: user.id}, "123", {expiresIn: '1h'});
        let token = jwt.generate();
        console.log("Jwt token:", token);
        return token

    }

    static async do_activity(token) {
        let decoded_token = jwt_token.decode_token(token)
        console.log("Decoded Token:", decoded_token);
        let id = decoded_token.id;
        console.log("User ID:", id);
        let users_data = await this.find_user({ id: id });
        console.log("User Data:", users_data);
        if (users_data.length === 0) {
            throw new Error("Invalid token");
        }
        let user = users_data[0];
        let jwt = new jwt_token({id: user.id}, "123", {expiresIn: '1h'});
        console.log("Validating token:")
        jwt.validate(token)
    }

    static async find_user(query) {
        let db = database.get_db_instance();
        return await db.find("users", query);
    }

    static async verify_password(plain_password, hashed_password) {
        console.log("Verifying password:", plain_password, hashed_password)
        const match = await bcrypt.compare(plain_password, hashed_password);
        if (match) {
            console.log("Password is correct!");
        } else {
            console.log("Password is incorrect.");
            throw new Error("Password is correct!");
        }
    }

    async create() {
        console.log("Creating user:", this.id, this.name, this.email, this.hashed_password);
        await this.db.create(this.collection, {id: this.id, name: this.name, email: this.email, hashed_password: this.hashed_password});
    }



    async updateUser(query, newData) {
        return await this.db.update(this.collection, query, newData);
    }

    async deleteUser(query) {
        return await this.db.delete(this.collection, query);
    }



}

module.exports = User;
