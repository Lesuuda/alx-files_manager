/* eslint-disable */

import express from 'express';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import AppController from '../controllers/AppController';

const router = express.Router()

//define the routes and the map them to controller methods
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

export default router;
