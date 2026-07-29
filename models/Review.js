const { DataTypes } = require("sequelize");
const db = require("../db");

const Review = db.define("Review", {
  description: { type: DataTypes.STRING(8000), allowNull: false },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    validate: {
      min: 1,
      max: 10,
    },
    allowNull: false,
  },
  platform: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Review;
