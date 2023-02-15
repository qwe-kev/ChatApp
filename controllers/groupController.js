const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const UserStatus = require('../models/userStatus');
const Group = require('../models/groups');
const UserGroup = require('../models/userGroup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');
const gender = require('gender-detection');
const Op = require('sequelize').Op;

module.exports.createGroup = async(req, res, next) => {
    try{
        console.log("----inside group route")
        const groupName = req.body.groupName;
        const admin = req.user.name;
        const members = req.body.members;
        const group = await Group.create({name:groupName, admin : admin})
        console.log('---members----', members);
        console.log('---group----', group);
        console.log('-----groupId-----', group.dataValues.id);
        const invitedMembers = await User.findAll({
            where : {
                name : {
                    [Op.or] : members
                }
            }
        })
        console.log('---invitedmembers------',invitedMembers);
        (async () => {
            await Promise.all(invitedMembers.map(async (user) => {
                const response = await UserGroup.create({isadmin : false, userId : user.dataValues.id, groupId : group.dataValues.id })
                console.log('----response----', response);
            }));
            await UserGroup.update({isadmin : true},{where : {userId : req.user.userId}});
        })();
        res.status(201).json({group : group.dataValues.name, members : members})
    }      
    catch(err) {
        console.log(err);
        res.status(404).json(err);
    }
}

module.exports.getGroups = async(req, res, next) => {
    try {
        const groups = await Group.findAll({
            attributes : ['name'],
            include: [
            {
              model: UserGroup,
              where:{userId:req.user.userId},
            },
          ],})
        console.log('---all groups for user-----', groups);
        res.status(200).json({groups : groups});
    }
    catch(err) {
        console.log(err);
        res.status(404).json(err);
    }
}

module.exports.getGroupMembers = async(req, res, next) => {
    try {
        console.log(req.params.groupId);
        const groupId = req.params.groupId;
        const users = await User.findAll({
            attributes : ['name'],
            include : [{
                model : UserGroup,
                where : {groupId : groupId},
            }
            ]
        })
        console.log('---group users---', users);
        res.status(200).json({groupUsers : users});

    }
    catch(err) {

    }
}