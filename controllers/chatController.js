const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const UserStatus = require('../models/userStatus');
const Chat = require('../models/chats');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');
const gender = require('gender-detection');

module.exports.showHome = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
}

module.exports.showActiveUsers = async(req, res, next) => {
    const activeUsers = await User.findAll({
        include : [{
            model : UserStatus,
            where : {status : true},
            attributes : ['avatar']
        }],
         attributes : ['name'],
        });
   // console.log("---active users -----", activeUsers);

    res.status(200).json({status:200, activeUsers : activeUsers, currentUser : req.user.name});
}

module.exports.newMessage = async(req, res, next) => {
    try {
        const message = req.body.message;
        const groupId = req.body.groupId;
        const response = await Chat.create({
        name : req.user.name,
        message : message,
        userId : req.user.userId,
        groupId : groupId
        })
        res.status(200).json({status : 200, message : 'successfully sent message'});
    }catch(err) {
        res.status(404).json({err})
    }
    
}

module.exports.getMessages = async(req, res, next) => {
    try{
        const messages = await Chat.findAll({
            attributes : ['name', 'message','createdAt', 'groupId', 'userId']
        });
        res.status(200).json({messages : messages})
    }
    catch(err) {
        console.log(err);
        res.status(404).json(err);
    }
}