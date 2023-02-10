const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');

const saltRounds = 10;

const hashPassword = async function(password) {
    return await bcrypt.hash(password, saltRounds);
}

module.exports.signUp = (req, res, next) => {
    res.status(200).sendFile(path.join(rootDir, 'views', 'signup.html'));
}

module.exports.createUser = async (req, res, next) => {
    try {
        console.log(req.body);

        const password = await hashPassword(req.body.password);
        console.log(password);
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            password : password
        })
    // if(!user) {
    //     throw new Error("User already exists");
    // }

    res.status(201).json({status : 201, message : "User created successfully", user});
    }
    catch(err) {
        console.log(err)
        res.json({status : 1062, error : err});
    }
}