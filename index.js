const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { event } = require('./models');
const imagekit = require('./lib/imagekit');
const upload = require('./middleware/Uploader');

const { verifyToken, verifyAdmin } = require('./middleware/VerifyToken')
const {getUsers, register, registerAdmin, login, loginAdmin, logout, editUsers, forgotPasswordOTP, resetPasswordOTP} = require('./controller/UserController')
const {getAllEvent, getAllEventAdmin, getEventById, getEventByIdAdmin, createTicket, getTicket, getTicketById, editTicket, deleteEventById, deleteTicket} = require("./controller/EventController")
const {order, payment, notificationsMidtransServer, createInvoice, resendInvoice} = require("./controller/OrderController")
const prefix = '/v1/api/';

const db = require('./config/db.config'); //Connect to database railway
// const db = require('./config/db.local.config'); //Connect to database local

// AUTH USER
app.get(prefix + 'users', getUsers);
app.post(prefix + 'register', register);
app.post(prefix + 'register-admin', registerAdmin);
app.post(prefix + 'login', login);
app.post(prefix + 'login-admin', loginAdmin);
app.delete(prefix + 'logout', logout);
app.put(prefix + 'editusers', verifyToken, editUsers);
app.put(prefix + 'editusers-admin', verifyAdmin, editUsers);
app.post(prefix + 'forgot-password-otp', forgotPasswordOTP);
app.post(prefix + 'reset-password-otp', resetPasswordOTP);

//EVENT LANDING PAGE
app.get(prefix + 'events', getAllEvent);
app.get(prefix + 'events/:eventId', getEventById);

//EVENT ADMIN
app.get(prefix + 'admin/events', verifyAdmin, getAllEventAdmin);
app.get(prefix + 'admin/event/:eventId', verifyAdmin, getEventByIdAdmin);
app.delete(prefix + 'admin/event/:eventId', verifyAdmin, deleteEventById);
app.post(prefix + 'admin/event/:eventId/ticket', verifyAdmin, createTicket);
app.get(prefix + 'admin/event/:eventId/ticket', verifyAdmin, getTicket);
app.get(prefix + 'admin/event/:eventId/ticket/:ticketId', verifyAdmin, getTicketById);
app.put(prefix + 'admin/event/:eventId/ticket/:ticketId', verifyAdmin, editTicket);
app.delete(prefix + 'admin/event/:eventId/ticket/:ticketId', verifyAdmin, deleteTicket);
app.post(
  prefix + "admin/create-event",
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      // request body => req.body.name
      const {
        event_name,
        jam_mulai,
        jam_selesai,
        venue,
        date,
        guest,
        description,
        syarat,
        qty
      } = req.body;
      const file = req.file;

      console.log(file);

      // untuk dapat extension file
      // image.jpg => jpg itu extension nya
      const split = file.originalname.split(".");
      const ext = split[split.length - 1];

      // proses upload file ke imagekit
      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`,
      });

      // proses insert atau create data yg dari request body ke DB/tabel
      // pakai sequelize method create utk proses data baru ke table/model nya
      await event.create({
        event_name,
        jam_mulai,
        jam_selesai,
        venue,
        date,
        guest,
        description,
        syarat,
        qty,
        status: "active",
        picture: img.url,
      });

      // response redirect page
      return res.status(200).json({
        success: true,
        message: "Create Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
app.put(
  prefix + "edit-event/:eventId",
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const eventId = req.params.eventId;

      // request body => req.body.name
      const {
        event_name,
        jam_mulai,
        jam_selesai,
        venue,
        date,
        guest,
        description,
        syarat,
        status,
        qty,
      } = req.body;

      const file = req.file;

      console.log(file);

      // jika ada file yang diupload, proses perubahan gambar
      if (file) {
        // untuk mendapatkan extension file
        const split = file.originalname.split(".");
        const ext = split[split.length - 1];

        // proses upload file ke imagekit
        const img = await imagekit.upload({
          file: file.buffer,
          fileName: `IMG-${Date.now()}.${ext}`,
        });

        // perbarui data event termasuk gambar baru
        await event.update(
          {
            event_name,
            jam_mulai,
            jam_selesai,
            venue,
            date,
            guest,
            description,
            syarat,
            status,
            qty,
            picture: img.url,
          },
          {
            where: {
              id: eventId,
            },
          }
        );
      } else {
        // jika tidak ada file yang diupload, perbarui data event tanpa mengubah gambar
        await event.update(
          {
            event_name,
            jam_mulai,
            jam_selesai,
            venue,
            date,
            guest,
            description,
            syarat,
            status,
            qty
          },
          {
            where: {
              id: eventId,
            },
          }
        );
      }

      // response
      return res.status(200).json({
        success: true,
        message: "Edit Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

// ORDER
app.post(prefix + 'order/:event_id/:ticket_id', verifyToken, order);
app.post(prefix + 'payment/:uniqueId', verifyToken, payment);
app.post(prefix + 'notifications', notificationsMidtransServer );
app.post(prefix + 'invoice/:orderId', verifyToken, createInvoice );
app.post(prefix + 'invoice/:orderId/resend', verifyToken, resendInvoice );

db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('error'));

app.get('/', (req, res) => {
  res.send('Ok! Server Running!');
});

app.listen(5000 || process.env.PORT, () => {
  console.log('Server Started');
  console.log(`Server Running on http://localhost:${port}`)
});
