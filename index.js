const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const {getUsers, register, login} = require('./controller/UserController')
const prefix = '/v1/api/';

// const db = require('./config/db.config'); //Connect to database railway
const db = require('./config/db.local.config'); //Connect to database local

// AUTH USER
app.get(prefix + 'users', getUsers);
app.post(prefix + 'register', register);
app.post(prefix + 'login', login);
// app.put(prefix + 'editusers', verifyToken, editUser);
// app.delete(prefix + 'logout', logout);
// app.post(prefix + 'forgotPassword', forgotPassword);
// app.post(prefix + 'forgot-password-otp', forgotPasswordOTP);
// app.post(prefix + 'reset-password', resetPassword);
// app.post(prefix + 'reset-password-otp', resetPasswordOTP);

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
