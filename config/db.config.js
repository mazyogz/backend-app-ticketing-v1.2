const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { DB_NAME, DB_PASSWORD, DB_USER, DB_URI } = process.env;

const db = new Sequelize(DB_URI, {
  define: {
    timestamps: false,
  },
});

module.exports = db;
