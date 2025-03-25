class UserModel {
    constructor(db) {
        this.db = db;
        this.collection = 'users';
    }

    async createUser(userData) {
        return await this.db.create(this.collection, userData);
    }

    async findUser(query) {
        return await this.db.find(this.collection, query);
    }

    async updateUser(query, newData) {
        return await this.db.update(this.collection, query, newData);
    }

    async deleteUser(query) {
        return await this.db.delete(this.collection, query);
    }
}

module.exports = UserModel;
