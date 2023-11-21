const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('app_ticketing_2', 'postgres', 'ariyogi', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
