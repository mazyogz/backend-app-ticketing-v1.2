'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactiondetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_time: {
        type: Sequelize.STRING
      },
      transaction_status: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      status_message: {
        type: Sequelize.STRING
      },
      status_code: {
        type: Sequelize.STRING
      },
      signature_key: {
        type: Sequelize.STRING
      },
      payment_type: {
        type: Sequelize.STRING
      },
      order_id: {
        type: Sequelize.STRING
      },
      gross_amount: {
        type: Sequelize.STRING
      },
      fraud_status: {
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
    await queryInterface.dropTable('transactiondetails');
  }
};