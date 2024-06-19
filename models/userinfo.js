'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    static associate(models) {
      // One-to-One relationship with User
      UserInfo.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }
  UserInfo.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserInfo',
  });
  return UserInfo;
};
