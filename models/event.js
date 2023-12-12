'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db.config'); // connect to database railway
// const sequelize = require('../config/db.local.config'); // connect to database local

module.exports = () => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  event.init({
    event_name: DataTypes.STRING,
    jam_mulai: DataTypes.STRING,
    jam_selesai: DataTypes.STRING,
    venue: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    picture: DataTypes.TEXT,
    guest: DataTypes.STRING,
    description: DataTypes.TEXT,
    syarat: DataTypes.TEXT,
    qty: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};