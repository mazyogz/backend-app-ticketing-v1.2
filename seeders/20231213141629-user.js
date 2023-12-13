'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "User1",
          password: await bcrypt.hash('88888888', 10), //setup with bcrypt encrypt
          nama_lengkap: "Supra",
          alamat: "Jatim",
          email: "supranatural345@gmal.com",
          nomor_telepon: "088888888888",
          otp: null,
          is_verified: null,
          is_user: "common-user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "Admin1",
          password: await bcrypt.hash('88888888', 10), //setup with bcrypt encrypt
          nama_lengkap: "Supra",
          alamat: "Jatim",
          email: "yogiprass11@gmail.com",
          nomor_telepon: "088888888888",
          otp: null,
          is_verified: null,
          is_user: "super-admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
