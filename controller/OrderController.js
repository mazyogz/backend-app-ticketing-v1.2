const { v4: uuidv4 } = require('uuid');
const { event, ticket, order } = require("../models");
const moment = require('moment');

exports.Order = async (req, res) => {
  const order_id_unik = uuidv4();
  const { event_id, ticket_id} = req.params 
  const userId = req.user.userId

  try {
    const ticket_data = await ticket.findOne({
        where: {
            id: ticket_id,
            id_event: event_id,
          },
    });
    const event_data = await event.findOne({
        where: {
            id: event_id,
          },
    });

    const tax = ticket_data.price * (10/100)

    const newOrder = await order.create({
      order_id_unik: order_id_unik,
      user_id: userId,
      event_id: event_id,
      ticket_id: ticket_id,
      gross: ticket_data.dataValues.price + tax,
      qty: 1,
      date_order: new Date(),
      time_order: moment().format("HH:mm:ss"),
      status: "unpaid",
    });

    const orderData = {
        id: newOrder.id,
        user_id: newOrder.user_id,
        event_id: newOrder.event_id,
        event_name: event_data.dataValues.event_name,
        ticket_id: newOrder.ticket_id,
        ticket_name: ticket_data.name,
        gross: newOrder.gross,
        date_order: newOrder.date_order,
        time_order: newOrder.time_order,
        status: newOrder.status,
      };

    res.status(201).json({
      status: true,
      message: "Pemesanan Berhasil",
      data: orderData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat membuat pemesanan",
      error: error.message,
    });
  }
};
