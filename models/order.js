'use strict';
const { DataTypes, Model} = require('sequelize');
// const sequelize = require('../config/db.config'); // connect to database railway
const sequelize = require('../config/db.local.config'); // connect to database local

module.exports = () => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    order_id_unik: DataTypes.STRING,
    event_id:DataTypes.INTEGER,
    ticket_id:DataTypes.INTEGER,
    date_order:DataTypes.DATE,
    time_order:DataTypes.STRING,
    gross: DataTypes.FLOAT,
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};