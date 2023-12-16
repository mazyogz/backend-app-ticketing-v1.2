'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db.config'); // connect to database railway
// const sequelize = require('../config/db.local.config'); // connect to database local

module.exports = () => {
  class invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invoice.init({
    user_id: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    email: DataTypes.STRING,
    invoice_code: DataTypes.STRING,
    order_id: DataTypes.STRING,
    is_generated: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'invoice',
  });
  return invoice;
};