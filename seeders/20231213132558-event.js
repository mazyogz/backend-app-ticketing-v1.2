'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "events",
      [
        {
          event_name: "Reality Club",
          jam_mulai: "18:00",
          jam_selesai: "21:00",
          venue: "Nancy Coffee, Banten",
          date: "2021-12-14",
          picture: "https://ik.imagekit.io/96v3ucrbi/IMG-1702391512135_WG26ApKxP.jpg",
          guest: "Reality Club",
          description: "Reality Club Presents... 2112 NIGHT'2112 Night' is an intimate showcase by Reality Club, as an appreciation towards their biggest fans. 2021 Levi's® Music Project Winners, Guernica Club, will be opening the night's festivities.The showcase will be held on 21 December 2021 at a secret place only disclosed to ticket purchasers.",
          syarat: "18+Bring IdentityNo Food and Beverage from outsideNo DrugsNo Harmful thingsNo petsNo Camera Professional",
          qty: 500,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  }
};
