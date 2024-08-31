'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VerificationCode extends Model {
    // 如果需要关联其他模型，可以在这里定义
    static associate(models) {
      // 示例：VerificationCode.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  VerificationCode.init({
    code_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'VerificationCode',
    tableName: 'verification_codes',
    timestamps: false,
  });

  return VerificationCode;
};
