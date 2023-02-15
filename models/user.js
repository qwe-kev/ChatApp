const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('user',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    phone : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false
    },
});

User.associate = function(models) {
    User.belongsToMany(models.Group, {
      through: 'UserGroup',
      foreignKey: 'userId',
      as: 'groups'
    });
  };

module.exports = User;