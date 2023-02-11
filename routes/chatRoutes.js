const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/auth');

router.get('/index.html', chatController.showHome);

router.get('/activeUsers', verifyToken, chatController.showActiveUsers);

router.post('/newMessage', verifyToken, chatController.newMessage);

module.exports = router;