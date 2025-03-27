const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const Database = require('./database_interface');

class CsvDatabase extends Database {
    constructor(dbPath) {
        super();
        this.dbPath = dbPath;
    }

    async connect() {
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, 'id,name,email,hashed_password\n'); // Initialize CSV with headers
        }
        console.log(`Connected to CSV Database at ${this.dbPath}`);
    }

    async create(collection, data) {
        const csvData = parse([data], { header: false });
        fs.appendFileSync(this.dbPath, `\n${csvData}`);

        return data;
    }

    async find(collection, query) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(this.dbPath)
                .pipe(csv())
                .on('data', (row) => {
                    let isMatch = Object.keys(query).every(key => row[key] == query[key]);
                    if (isMatch) results.push(row);
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async update(collection, query, newData) {
        return new Promise((resolve, reject) => {
            const tempFile = `${this.dbPath}.tmp`;
            const results = [];

            fs.createReadStream(this.dbPath)
                .pipe(csv())
                .on('data', (row) => {
                    let isMatch = Object.keys(query).every(key => row[key] == query[key]);
                    if (isMatch) {
                        results.push({ ...row, ...newData }); // Update data
                    } else {
                        results.push(row);
                    }
                })
                .on('end', () => {
                    const csvOutput = parse(results, { header: true });
                    fs.writeFileSync(tempFile, csvOutput);
                    fs.renameSync(tempFile, this.dbPath);
                    resolve(results);
                })
                .on('error', (error) => reject(error));
        });
    }

    async delete(collection, query) {
        return new Promise((resolve, reject) => {
            const tempFile = `${this.dbPath}.tmp`;
            const results = [];

            fs.createReadStream(this.dbPath)
                .pipe(csv())
                .on('data', (row) => {
                    let isMatch = Object.keys(query).every(key => row[key] == query[key]);
                    if (!isMatch) results.push(row); // Keep only non-matching rows
                })
                .on('end', () => {
                    const csvOutput = parse(results, { header: true });
                    fs.writeFileSync(tempFile, csvOutput);
                    fs.renameSync(tempFile, this.dbPath);
                    resolve(true);
                })
                .on('error', (error) => reject(error));
        });
    }

    async close() {
        console.log("CSV Database closed.");
    }
}

module.exports = CsvDatabase;
