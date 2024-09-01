/* eslint-disable */

const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router()

//define the routes and the map them to controller methods
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
