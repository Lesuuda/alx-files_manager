/* eslint-disable */

import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';


class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        //check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Missig email' });
        }

        //check if password is provided
        if (!password) {
            return res.status(400).json({ error: 'Missing password'});
        }

        //check if email already exists
        const usersCollection = dbClient.db.collection('users');
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        //hash the password using SHA1
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        //craete ne wuser in the database
        const newUser = await usersCollection.insertOne({
            email,
            password: hashedPassword,
        });

        //return the new user object with email and id
        return res.status(201).json({ id: newUser.insertedId, email});
    }

    static async getMe(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).send({ error: 'Unaauthorized' });
        }
        const userId = await redisClient.get(`auth_${token}`);

        if (!userId) {
            return res.status(401).send({error: 'Unauthorized' });
        }

        const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send({error: 'User not found' })
        }
        return res.status(200).send({ id: user._id, email: user.email});
    } 
}
export default UsersController;
