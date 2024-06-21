'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'id')
    await queryInterface.removeColumn('Users', 'UserId')

    await queryInterface.addColumn('Users', 'UserId', {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('Users', 'UserId')
  }
};
