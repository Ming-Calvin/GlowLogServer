'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Diary extends Model {
    static associate(models) {
      // 定义模型之间的关联
      Diary.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // 定义与附件的关联
      Diary.hasMany(models.Attachment, {
        foreignKey: 'business_id',
        as: 'attachments',
        constraints: false, // 禁用外键约束
        scope: {
          business_type: 'diary' // 限制业务类型为 'diary'
        }
      });
    }
  }

  Diary.init({
    diary_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    author_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mood: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'Diary',
    tableName: 'diaries',
    timestamps: false,  // 禁用 Sequelize 自动添加的 createdAt 和 updatedAt 字段
  });

  return Diary;
};
