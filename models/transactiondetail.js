'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db.config'); // connect to database railway
// const sequelize = require('../config/db.local.config'); // connect to database local

module.exports = () => {
  class transactiondetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transactiondetail.init({
    transaction_time: DataTypes.STRING,
    transaction_status: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    status_message: DataTypes.STRING,
    status_code: DataTypes.STRING,
    signature_key: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    order_id: DataTypes.STRING,
    gross_amount: DataTypes.STRING,
    fraud_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactiondetail',
  });
  return transactiondetail;
};