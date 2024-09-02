/* eslint-disable */

import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import sha1 from 'sha1';

class AuthController {
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic')) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const base64Crededentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Crededentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        if (!email || !password) {
            return res.status(401).send({ error: 'Unauthorized'});
            
        }
        const hashedPassword = sha1(password);
        const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword});
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const token = uuidv4();
        const tokenKey = `auth_${token}`;
        await redisClient.set(tokenKey, user._id.toString(), 86400) //24 hours in seconds
        return res.status(200).send({ token })
    }

    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const tokenKey = `auth_${token}`;
        const userId = await redisClient.get(tokenKey);

        if (!userId) {
            return res.status(401).send({ error: 'Unathorized' });
        }
        await redisClient.del(tokenKey);
        return res.status(204).send();
    }
}
export default AuthController;
