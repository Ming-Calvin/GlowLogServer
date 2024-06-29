'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('WhiteNoises', 'id')

    await queryInterface.addColumn('WhiteNoises', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {

  }
};
