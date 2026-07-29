const { DataTypes } = require("sequelize");
const db = require("../db");

const Game = db.define("Game", {
  title: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  //  ESRB: {type: DataTypes.STRING, allowNull: false},
  ESRB: {
    type: DataTypes.STRING,
    validate: {
      is: /^[ETM]*$/i,
    },
    allowNull: true,
  },
});

module.exports = Game;
