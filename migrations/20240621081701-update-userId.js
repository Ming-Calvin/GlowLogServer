'use strict';

const {query} = require("koa/lib/request");
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'UserId')

    await queryInterface.addColumn('Users', 'userId', {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    })

    // Set the initial auto-increment value for userId
    await queryInterface.sequelize.query('ALTER TABLE Users AUTO_INCREMENT = 100000;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'userId')
  }
};
