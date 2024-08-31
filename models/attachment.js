'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    static associate(models) {
      // 在这里定义与其他模型的关系（如果有）
      // 例如：Attachment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Attachment.init({
    attachment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    sequelize,
    modelName: 'Attachment',
    tableName: 'attachments',
    timestamps: false, // 禁用 Sequelize 自动添加的 createdAt 和 updatedAt 字段
  });

  return Attachment;
};
