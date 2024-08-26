'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
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
    tableName: 'attachments',
    timestamps: false
  });

  return Attachment;
};
