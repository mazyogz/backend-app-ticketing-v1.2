const { v4: uuidv4 } = require("uuid");
const { event, ticket, order, transactiondetail, user, invoice } = require("../models");
const moment = require("moment");
const midtransClient = require('midtrans-client');
const nodemailer = require("nodemailer");
const qrImage = require("qr-image")


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
      time_order: moment().add(7, 'hours').format("HH:mm:ss") + ' WIB' ,
      status: "unpaid",
    });

    const orderData = {
      id: newOrder.id,
      orderId: newOrder.order_id_unik,
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
  const ticketInvoiceCode = uuidv4();
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
        let transaction_time = statusResponse.transaction_time;
        let transactionStatus = statusResponse.transaction_status;
        let transaction_id = statusResponse.transaction_id;
        let status_message = statusResponse.status_message;
        let status_code = statusResponse.status_code;
        let signature_key = statusResponse.signature_key;
        let payment_type = statusResponse.payment_type;
        let orderId = statusResponse.order_id;
        let gross_amount = statusResponse.gross_amount;
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
            transactiondetail.create({
              transaction_time: transaction_time,
              transaction_status: transactionStatus,
              transaction_id: transaction_id,
              status_message: status_message,
              status_code: status_code,
              signature_key: signature_key,
              payment_type: payment_type,
              order_id: orderId,
              gross_amount: gross_amount,
              fraud_status: fraudStatus,
            });
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
          transactiondetail.create({
            transaction_time: transaction_time,
            transaction_status: transactionStatus,
            transaction_id: transaction_id,
            status_message: status_message,
            status_code: status_code,
            signature_key: signature_key,
            payment_type: payment_type,
            order_id: orderId,
            gross_amount: gross_amount,
            fraud_status: fraudStatus,
          });
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
          transactiondetail.create({
            transaction_time: transaction_time,
            transaction_status: transactionStatus,
            transaction_id: transaction_id,
            status_message: status_message,
            status_code: status_code,
            signature_key: signature_key,
            payment_type: payment_type,
            order_id: orderId,
            gross_amount: gross_amount,
            fraud_status: fraudStatus,
          });
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
          transactiondetail.create({
            transaction_time: transaction_time,
            transaction_status: transactionStatus,
            transaction_id: transaction_id,
            status_message: status_message,
            status_code: status_code,
            signature_key: signature_key,
            payment_type: payment_type,
            order_id: orderId,
            gross_amount: gross_amount,
            fraud_status: fraudStatus,
          });
          res.status(200).json({ message: "OK" });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  // const invoiceId = uuidv4();
  const generateRandomAlphaNumeric = (length) => {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      result += alphanumericChars.charAt(randomIndex);
    }
  
    return result;
  };
  
  // Contoh penggunaan untuk menghasilkan string alfanumerik 11 karakter
  const invoiceId = generateRandomAlphaNumeric(11);

  // const qrCodeDataURL = await qrcode.toDataURL(invoiceId, { width: 300, height: 300 });
  const qrCodeBuffer = await qrImage.image(invoiceId, { type: 'png', size: 10 }); // Atur ukuran di sini
  const qrCodeDataURL = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;

  const { orderId } = req.params;
  const userData = req.user;

  try {
    // const isGeneratedInvoice = await invoice.findOne({
    //   where: {
    //     order_id: orderId,
    //     is_generated: "true"
    //   }
    // })

    // if (isGeneratedInvoice) {
    //   return res.status(404).json({
    //     success: false,
    //     message: `Invoice already generated!`,
    //   });
    // }

    const orderData = await transactiondetail.findOne({
      where: {
        order_id: orderId,
        transaction_status: "settlement" || "capture",
        fraud_status: "accept"
      },
    });

    if (!orderData) {
      return res.status(404).json({
        success: false,
        message: `Transactions did not success or pending, please complete transactions!`,
      });
    }

    const userVerificationsTransactions = await order.findOne({
      user_id: userData.userId,
      order_id_unik: orderId
    })

    if (!userVerificationsTransactions) {
      return res.status(404).json({
        success: false,
        message: `Transactions did not found`,
      });
    }

    const createInvoice = await invoice.create({
      user_id: userData.userId,
      nama_lengkap: userData.nama_lengkap,
      email: userData.email,
      invoice_code:invoiceId,
      order_id: orderId,
      is_generated: "true"
    })

    const responseData = {
      userId: createInvoice.user_id,
      nama_lengkap: createInvoice.nama_lengkap,
      email: createInvoice.email,
      invoice_code: createInvoice.invoice_code,
      order_id: createInvoice.order_id,
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "symphonyseatsofficial@gmail.com",
        pass: "tvrj jgxx ifnf xfaj",
      },
    });

    const htmlBody = `
    <p>Hi ${createInvoice.nama_lengkap},</p>
    <p>Your ticket details:</p>
    <ul>
      <li>Nama Lengkap: ${createInvoice.nama_lengkap}</li>
      <li>Email: ${createInvoice.email}</li>
      <li>Invoice Code: ${createInvoice.invoice_code}</li>
      <li>Order ID: ${createInvoice.order_id}</li>
    </ul>
    <p>Ini adalah gambar barcode:</p><br/><img src="${qrCodeDataURL}" alt="Barcode"/>
  `;

    const mailOptions = {
      from: "Symphony Seats Official",
      to: responseData.email,
      subject: "Your Ticket Was Ready!",
      html:htmlBody,
      attachments: [
        {
          filename: 'barcode.png',
          content: qrCodeDataURL.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send tickets" });
      }
      console.log("Email sent!:", info.response);
    });

    res.status(201).json({
      status: true,
      message: `Invoice Successfully Generated and sent to ${responseData.email} `,
      data: responseData, 
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat membuat pemesanan",
      error: error.message,
    });
  }
};