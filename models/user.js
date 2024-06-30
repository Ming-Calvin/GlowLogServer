'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-One relationship with UserInfo
      User.hasOne(models.UserInfo, { foreignKey: 'userId', as: 'info' })
      User.hasMany(models.Journal, { foreignKey: 'userId', as: 'journals' });
    }
  }
  User.init({
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Default value set to false
    }
  }, {
    sequelize,
    modelName: 'User',
    hook: {
      beforeCreate: async (user, options) => {
        const lastUser = await User.findOne( { order: [['userId', 'DESC']] });
        user.userId = lastUser ? lastUser.userId + 1 : 100000
      }
    }
  });
  return User;
};
