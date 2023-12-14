'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id_unik: {
        type: Sequelize.STRING
      },
      event_id: {
        type: Sequelize.INTEGER
      },
      ticket_id: {
        type: Sequelize.INTEGER
      },
      date_order: {
        type: Sequelize.DATE
      },
      time_order: {
        type: Sequelize.STRING
      },
      gross: { 
        type: Sequelize.FLOAT
      },
      token: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('orders');
  }
};