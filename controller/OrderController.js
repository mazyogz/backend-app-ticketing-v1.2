const { v4: uuidv4 } = require("uuid");
const { event, ticket, order } = require("../models");
const moment = require("moment");
const midtransClient = require('midtrans-client');


exports.order = async (req, res) => {
  const order_id_unik = uuidv4();
  const { event_id, ticket_id } = req.params;
  const userData = req.user;

  try {
    const ticket_data = await ticket.findOne({
      where: {
        id: ticket_id,
        id_event: event_id,
        status: "Available",
      },
    });

    const event_data = await event.findOne({
      where: {
        id: event_id,
      },
    });

    if (!event_data) {
      return res.status(404).json({
        success: false,
        message: `Event unavailable!`,
      });
    }
    if (!ticket_data) {
      return res.status(404).json({
        success: false,
        message: `Ticket unavailable!`,
      });
    }

    const tax = ticket_data.price * (10 / 100);

    const newOrder = await order.create({
      order_id_unik: order_id_unik,
      user_id: userData.userId,
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
      orderId:order_id_unik,
      nama: userData.nama_lengkap,
      email: userData.email,
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

exports.payment = async (req, res) => {
  const userData = req.user;
  const { uniqueId } = req.params;
  try {
    const orderData = await order.findOne({
      where: {
        order_id_unik: uniqueId,
      },
    });
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-v4ZJdgQET4My17Ngk-pb6T1g",
      clientKey: "SB-Mid-client-HV7aOKK1G2a7GXBn",
    });

    const parameter = {
      transaction_details: {
        order_id: uniqueId,
        gross_amount: Math.ceil(orderData.dataValues.gross),
      },
      customer_details: {
        first_name: userData.nama_lengkap,
        email: userData.email
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;

      res.status(200).json({ message: "berhasil", dataPayment, token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.notificationsMidtransServer = async (req, res) => {
  try {
    const notificationJson = req.body;

    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-v4ZJdgQET4My17Ngk-pb6T1g",
      clientKey: "SB-Mid-client-HV7aOKK1G2a7GXBn",
    });

    apiClient.transaction
      .notification(notificationJson)
      .then((statusResponse) => {
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(
          `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        );

        // Sample transactionStatus handling logic

        if (transactionStatus == "capture") {
          if (fraudStatus == "accept") {
            order.update(
              {
                status: transactionStatus,
              },
              {
                where: {
                  order_id_unik: orderId,
                },
              }
            );
            res.status(200).json({ message: "OK" });
          }
        } else if (transactionStatus == "settlement") {
          order.update(
            {
              status: transactionStatus,
            },
            {
              where: {
                order_id_unik: orderId,
              },
            }
          );
          res.status(200).json({ message: "OK" });
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "deny" ||
          transactionStatus == "expire"
        ) {
          order.update(
            {
              status: transactionStatus,
            },
            {
              where: {
                order_id_unik: orderId,
              },
            }
          );
          res.status(200).json({ message: "OK" });
        } else if (transactionStatus == "pending") {
          order.update(
            {
              status: transactionStatus,
            },
            {
              where: {
                order_id_unik: orderId,
              },
            }
          );
          res.status(200).json({ message: "OK" });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};