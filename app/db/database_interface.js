class DatabaseInterface {

    async connect() {
        throw new Error("Method 'connect' must be implemented.");
    }

    async find(collection, query) {
        throw new Error("Method 'find' must be implemented.");
    }

    async create(collection, data) {
        throw new Error("Method 'create' must be implemented.");
    }

    async update(collection, query, newData) {
        throw new Error("Method 'update' must be implemented.");
    }

    async delete(collection, query) {
        throw new Error("Method 'delete' must be implemented.");
    }

    async close() {
        throw new Error("Method 'close' must be implemented.");
    }
}

module.exports = DatabaseInterface;
