'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-One relationship with UserInfo
      User.hasOne(models.UserInfo, { foreignKey: 'userId', as: 'info' })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Default value set to false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
