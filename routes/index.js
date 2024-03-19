// Setting up routes
const express = require('express');
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();


// Get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// Post Routes
router.post('/users', UsersController.postNew);

module.exports = router;
