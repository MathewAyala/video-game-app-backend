const db = require('../db')
const Game = require('./Game')
const User = require('./User')
const Review = require('./Review')


Game.hasMany(Review);
Review.belongsTo(Game);


User.belongsToMany(Game, {through: 'UserGame'})
Game.belongsToMany(User, {through: 'UserGame'})

module.exports = {db, Game, User, Review}