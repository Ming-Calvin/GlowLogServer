'use strict';
module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('VerificationCode', {
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
    tableName: 'verification_codes',
    timestamps: false
  });

  return VerificationCode;
};
