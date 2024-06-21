'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the userId column as nullable initially
    await queryInterface.addColumn('Users', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null to update existing records
      unique: true
    });

    // Set initial userId values for existing records
    await queryInterface.sequelize.query(`
      UPDATE Users
      SET userId = id + 100000
      WHERE userId IS NULL;
    `);

    // Change userId to not allow null
    await queryInterface.changeColumn('Users', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the userId column
    await queryInterface.removeColumn('Users', 'userId');
  }
};
