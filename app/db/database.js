const mongo_db = require("./mongo_db");
const csv_db = require("./csv_db");

class database {
    static instance = null;

    constructor(db_type) {
        if (!database.instance) {
            this.db_type = db_type;
            this.initialize_db();
            database.instance = this;
        }
        return database.instance;
    }

    async initialize_db() {
        if (this.db_type === "mongo") {
            this.db_instance = new mongo_db('mongodb://localhost:27017', 'testDB');
        } else {
            this.db_instance = new csv_db('users.csv');
        }
        await this.db_instance.connect();
    }

    static get_db_instance() {
        if (!database.instance || !database.instance.db_instance) {
            throw new Error('Database not initialized');
        }
        return database.instance.db_instance;
    }
}

module.exports = database;