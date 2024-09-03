/* eslint-disable */

import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
    static async postUplaod(res, req) {
        const token = req.headers['x-token'];
        const { name,  type, parentId = 0, isPulic = false, data} = req.body;

        if(!token) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        if(!user) {
            res.status(401).send({ error: 'Unauthorized' });
        }

        if(!name) {
            res.status(400).send({ error: 'Missing name' });
        }
        if (!type || !['folder', 'file', 'image'].includes(type)) {
            res.status(400).send({ error: 'Missing type'});
        }

        if (type !== 'folder' && !data) {
            return res.status(400).send({ error: 'Missing data' });
        }

        if (parentId !== 0) {
            const parentFile = await dbClient.db.collection('files').findOne({ _id: parentId });
            if (!parentFile) {
                return res.status(400).send({ error: 'Parent not found'});
            }
            if (parentFile.type !== 'folder') {
                return res.status(400).send({ error: 'Parent is not a folder'});

            } 
        }

        const newFile = {
            userId,
            name,
            type,
            isPulic,
            parentId,
        };
        if (type === 'folder') {
            const result = await dbClient.db.collection('files').insertOne(newFile);
            return res.status(201).send({ ...newFile, _id: result.insertedId });
        }

        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        const localPath = `${folderPath}/${uuidv4}`;
        try {
            await fs.mkdir(folderPath, { recursive: true });
            await fs.writeFile(localPath, Buffer.from(data, 'base64'));

            newFile.localPath = localPath;
            const result = await dbClient.db.collection('files').insertOne(newFile);
            res.status(201).send({ ...newFile, _id: result.insertedId});
        } catch (error) {
            res.status(500).send({ error: 'Error saving files' });
        }
    }
}
export default FilesController;
