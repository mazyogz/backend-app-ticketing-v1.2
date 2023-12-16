"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          order_id_unik: "70d6a77f-d748-4a8f-b928-f5c212bfff92",
          event_id: 2,
          ticket_id: 2,
          date_order: "2023-12-15",
          time_order:"14:46:01 WIB",
          gross: 61048.9,
          token: null,
          user_id: 5,
          qty: 1,
          status:"settlement",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id_unik: "9e99e603-f6f3-40e3-b050-54f7bcc1ee05",
          event_id: 2,
          ticket_id: 2,
          date_order: "2023-12-15",
          time_order:"07:27:25 WIB",
          gross: 61048.9,
          token: null,
          user_id: 5,
          qty: 1,
          status:"expire",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
