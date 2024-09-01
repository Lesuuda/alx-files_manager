/* eslint-disable */

const { MongoClient } = require('mongodb');

//get environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_HOST || '27017';
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

//mongodb conection
const url = `mongodb://${DB_HOST}:${DB_PORT}`;
const dbName = DB_DATABASE;

class DBClient {
    constructor() {
        //initialize the mongodb client
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                console.log('Connected to mongodb');
                this.db = this.client.db(dbName);
            })
            .catch((error) => {
                console.error('Error connecting to mongodb:', error);
            });
    }

    //method to check if mongodb client is connected
    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected()
    }
    //async function to count users in  the files connection
    async nbUsers() {
        if (!this.isAlive()) {
            return 0;
        }
        try {
            const usersCollection = this.db.collection('users');
            return await usersCollection.countDocuments();
        } catch (error) {
            console.error('Error counting users:', error);
            return 0;
        }
    }

    //async function to count documents in the 'files' connection
    async nbFiles() {
        if (!this.isAlive()) {
            return 0;
        } 
        try {
            const filesCollection = this.db.collection('files');
            return await filesCollection.countDocuments();
        } catch (error) {
            console.error('Error counting files:', error);
            return 0;
        }
    }
}
const dbClient = new DBClient();
module.exports = dbClient;
