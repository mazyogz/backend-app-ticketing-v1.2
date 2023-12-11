'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db.config'); // connect to database railway
// const sequelize = require('../config/db.local.config'); // connect to database local

module.exports = () => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    alamat: DataTypes.STRING,
    email: DataTypes.STRING,
    nomor_telepon: DataTypes.STRING,
    otp: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_user: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};