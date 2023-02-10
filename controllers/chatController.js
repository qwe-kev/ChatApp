const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const UserStatus = require('../models/userStatus');
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
    console.log("---active users -----", activeUsers);

    res.status(200).json({status:200, activeUsers : activeUsers});
}