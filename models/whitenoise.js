'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WhiteNoise extends Model {
    // 可以在这里定义模型之间的关联
    static associate(models) {
      // 定义与附件的关联
      WhiteNoise.hasMany(models.Attachment, {
        foreignKey: 'business_id',
        as: 'attachments',
        constraints: false, // 禁用外键约束
        scope: {
          business_type: 'whiteNoise' // 限制业务类型为 'diary'
        }
      });
    }
  }

  WhiteNoise.init({
    white_noise_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    play_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    sequelize,
    modelName: 'WhiteNoise',
    tableName: 'white_noises',
    timestamps: false,  // 禁用 Sequelize 自动添加的 createdAt 和 updatedAt 字段
  });

  return WhiteNoise;
};
