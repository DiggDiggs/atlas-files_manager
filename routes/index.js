// All endpoints for the API are defined here
const express = require('express');

// controllers
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// get routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.get('/files/:id/data', FilesController.getFile);

// post routes
router.post('/users', UsersController.postNew);
router.post('/files', FilesController.postUpload);

// put routes
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

module.exports = router;

