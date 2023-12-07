'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_name: {
        type: Sequelize.STRING
      },
      jam_mulai: {
        type: Sequelize.TIME
      },
      jam_selesai: {
        type: Sequelize.TIME
      },
      venue: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      picture: {
        type: Sequelize.TEXT
      },
      guest: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      syarat: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events');
  }
};