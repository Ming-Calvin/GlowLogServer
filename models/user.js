'use strict';

// 引入 Sequelize 模块的 Model 类
const { Model } = require('sequelize');

// 导出一个函数，函数接收 sequelize 实例 和 DataTypes 作为参数
module.exports = (sequelize, DataTypes) => {
  // 定义一个新的模型类 User, 继承自 Model
  class User extends Model {
    // 定义模型的关联关系
    static associate(models) {

    }
  }

  // 初始化 User 模型，定义模型属性
  User.init({
    // 定义 username 属性，类型为字符串
    userName: DataTypes.STRING,
    // 定义 password 属性，类型为字符串
    password: DataTypes.STRING,
    // 定义 email 属性，类型为字符串
    email: DataTypes.STRING
  }, {
    // 将 sequelize 实例传递给模型
    sequelize,
    // 指定模型的名称为 'User'
    modelName: 'User',
  });

  // 定义返回好的 User 模型
  return User;
};
