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

const checkUser = async function(password, hash) {
    return new Promise((resolve, reject) => {
        resolve(bcrypt.compare(password, hash));
    })
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

module.exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}

module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findAll({
            where : {
                'email' : req.body.email
            }
        })
        if(user.length > 0) {
            const response = await checkUser(req.body.password, user[0].dataValues.password);
            console.log("---user----", response);
            if(response) {
                res.status(200).json({status : 200, message : "successfully logged in"})

            }
        }
    }
    catch(err) {
        console.log(err);
    }
}