const { MongoClient } = require('mongodb');
const DatabaseInterface = require('./database_interface');

class MongoDatabase extends DatabaseInterface {
    constructor(uri, dbName) {
        super();
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = dbName;
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        console.log(`Connected to MongoDB: ${this.dbName}`);
    }

    async create(collection, data) {
        return await this.db.collection(collection).insertOne(data);
    }

    async update(collection, query, newData) {
        return await this.db.collection(collection).updateOne(query, { $set: newData });
    }

    async delete(collection, query) {
        return await this.db.collection(collection).deleteOne(query);
    }

    async close() {
        await this.client.close();
        console.log("Database connection closed");
    }
}

module.exports = MongoDatabase;
