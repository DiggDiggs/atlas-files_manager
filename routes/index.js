// All endpoints for the API are defined here
const express = require('express');

// controllers
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// get routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// post routes

module.exports = router;
