'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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
    jam_mulai: DataTypes.TIME,
    jam_selesai: DataTypes.TIME,
    venue: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    picture: DataTypes.TEXT,
    guest: DataTypes.STRING,
    description: DataTypes.TEXT,
    syarat: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};