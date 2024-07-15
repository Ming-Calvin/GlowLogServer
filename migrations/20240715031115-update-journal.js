'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Journals', 'title', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null to update existing records
    });
    await queryInterface.addColumn('Journals', 'favorites', {
      type: Sequelize.INTEGER,
        allowNull: true, // Temporarily allow null to update existing records
    });
    await queryInterface.addColumn('Journals', 'comments', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null to update existing records
    });
    await queryInterface.addColumn('Journals', 'views', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null to update existing records
    });
    await queryInterface.addColumn('Journals', 'tags', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null to update existing records
    });
  },

  async down (queryInterface, Sequelize) {
  }
};
