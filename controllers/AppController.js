/* eslint-disable */

const redisClient = require('../utils/redis');
const dbClient =  require('../utils/db');

class AppController {
    static getStatus(req, res) {
        //return the status of the redis and mongodb
            res.status(200).json({
                redis: redisClient.isAlive(),
                db: dbClient.isAlive(),

        });
    }
    static async getStats(req, res) {
        //return the number of users and the files in the database
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();

        res.status(200).json({
            users,
            files,
        });
    }
}
module.exports = AppController;
