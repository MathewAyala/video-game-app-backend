const {DataTypes} = require('sequelize')
const db = require('../db')

const User = db.define('User',{
    username: {type: DataTypes.STRING, allowNull: false},
    platform: {type: DataTypes.STRING, allowNull: true},
})

module.exports = User