/* eslint-disable */

const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        //create a redis client

        this.client = redis.createClient();

        //log any errors encountred
        this.client.on('error', (error => {
            console.error('Redis Client Error:', error);
        }));

        //promisify redis methods for async/await usage
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);

        
    }
    //method to check of redis client is connected
    isAlive() {
        return this.client.connected;
    }

    //async method that gets a value by key
    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value;
        } catch (error) {
            console.error('Error getting key from Redis:', error);
            return null;
        }
    }

    // async function to set key, value pair with expiration
    async set(key, value, duration) {
        try {
            await this.setAsync(key, value);
            await this.client.expire(key, duration);
        } catch (error) {
            console.error('Error setting key in Redis:', error);
        }
    }

    //async function to delete a key
    async del(key) {
        try {
            await this.delAsync(key);

        } catch (error) {
            console.error('Error deleting key from Redis:', error);
        }
    }
}

//create and export an instance of redis client
const redisClient = new RedisClient();
module.exports = redisClient;
