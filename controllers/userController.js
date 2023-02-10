const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const UserStatus = require('../models/userStatus');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');
const gender = require('gender-detection');


const saltRounds = 10;

const hashPassword = async function(password) {
    return await bcrypt.hash(password, saltRounds);
}

const generateToken = function(id, email) {
    return jwt.sign({userId : id, email}, process.env.SECRET_KEY, {expiresIn : "24h"});
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
        console.log('---create user---', user.dataValues);
        if(user) {
            const userStatus = UserStatus.create({
                userId : user.dataValues.id,
                status : false
            })
        }
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
                const userRes = await UserStatus.findAll({where : {'userId' : user[0].dataValues.id}})
                console.log('--found user---', userRes);
                const g = gender.detect(user[0].dataValues.name);
                let updatedUser = userRes[0];
                updatedUser.status = true;
                if(g == 'female') {
                    updatedUser.avatar = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                }
                else {
                    updatedUser.avatar = 'https://bootdey.com/img/Content/avatar/avatar1.png';
                }
               
                await updatedUser.save()
                res.status(200).json({status : 200, message : "successfully logged in", token : generateToken(user[0].dataValues.id, user[0].dataValues.email)})
            }
            else {
                res.status(401).json({status : 401, message : "User not authorized"});
            }
        }
        else {
            res.status(404).json({status : 404, message : "User not found"});
        }
    }
    catch(err) {
        console.log(err);
    }
}