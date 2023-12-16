'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transactiondetails",
      [
        {
          transaction_time: "2023-12-15 17:17:59",
          transaction_status: "expire",
          transaction_id: "7e4ae614-8555-4919-a602-d66c301ffc2f",
          status_message: "Success, transaction is found",
          status_code: "407",
          signature_key: "f0eacf4041bb21c989990aa2dddaccfe907ee33c14ea603a75aed0dd62464058f75134e1857db0ac55cb4ba390cfcfb848104e0af284d640b1be5fc1559e0483" ,
          payment_type: "cstore",
          order_id: "9e99e603-f6f3-40e3-b050-54f7bcc1ee05",
          gross_amount: "61049.00",
          fraud_status: "accept",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          transaction_time: "2023-12-15 17:30:07",
          transaction_status: "settlement",
          transaction_id: "198b2617-d668-4ae1-a1a8-ec7149e2719c",
          status_message: "Success, transaction is found",
          status_code: "100",
          signature_key: "af3e34d71d8f5640a71ccaf31f92fb01f04b2a1eb1ac420447d24a4b21a486857054b5d0bb84029f62e86f72b829b1eaab2eb78987b10107d992eca15864821c" ,
          payment_type: "bank_transfer",
          order_id: "70d6a77f-d748-4a8f-b928-f5c212bfff92",
          gross_amount: "61049.00",
          fraud_status: "accept",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactiondetails", null, {});
  }
};
