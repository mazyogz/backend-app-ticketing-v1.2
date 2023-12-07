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
const upload = require('./middleware/uploader');

const { verifyToken, verifyAdmin } = require('./middleware/VerifyToken')
const {getUsers, register, registerAdmin, login, loginAdmin, logout, editUsers, forgotPasswordOTP, resetPasswordOTP} = require('./controller/UserController')
const {createEvent} = require("./controller/EventController")
const prefix = '/v1/api/';

// const db = require('./config/db.config'); //Connect to database railway
const db = require('./config/db.local.config'); //Connect to database local

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

//EVENT ADMIN
app.post(
  prefix + "create-event",
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
