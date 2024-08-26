'use strict';
module.exports = (sequelize, DataTypes) => {
  const Diary = sequelize.define('Diary', {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mood: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    tableName: 'diaries',
    timestamps: false
  });

  Diary.associate = function(models) {
    Diary.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Diary;
};
