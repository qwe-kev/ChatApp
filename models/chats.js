const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Chat = sequelize.define('chat',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    message : {
        type : Sequelize.STRING,
    }
});

module.exports = Chat;