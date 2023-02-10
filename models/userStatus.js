const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const UserStatus = sequelize.define('userstatus',{
    status : {
        type : Sequelize.BOOLEAN,
        allowNull : true
    },
    avatar : {
        type : Sequelize.STRING,
        allowNull : true
    }
});

module.exports = UserStatus;