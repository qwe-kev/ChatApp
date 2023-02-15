const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.get('/signup', userController.signUp);

router.post('/createUser', userController.createUser);

router.get('/login', userController.getLogin);

router.post('/login', userController.login);


module.exports = router;