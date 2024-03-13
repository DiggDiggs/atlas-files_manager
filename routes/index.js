// All endpoints for the API are defined here
const express = require('express');

// controllers
const AppController = require('../controllers/AppController');
const router = express.Router();

// get routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);


module.exports = router;