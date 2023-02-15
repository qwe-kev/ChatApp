const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const groupController = require('../controllers/groupController');
const verifyToken = require('../middleware/auth');

router.post('/newGroup', verifyToken,  groupController.createGroup);

router.get('/getGroups', verifyToken, groupController.getGroups);

router.get('/users/:groupId', verifyToken, groupController.getGroupMembers);

module.exports = router;