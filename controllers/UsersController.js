/* eslint-disable */

const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        //check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Missig email' });
        }

        //check if password is provided
        if (!password) {
            return res.status(400).json({ error: 'Missing Password'});
        }

        //check if email already exists
        const usersCollection = dbClient.db.collection('users');
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Already exists' });
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
}
module.exports = UsersController;
