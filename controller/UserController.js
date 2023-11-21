const { user } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.getUsers = async (req, res) => {
  try {
    const userData = await user.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "nama_lengkap",
        "alamat",
        "nomor_telepon",
        "isUser",
      ],
      order: [["id", "ASC"]],
    });
    if (userData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "List All Users",
      data: userData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.register = async (req, res) => {
  const { username, password, nama_lengkap, alamat, email, nomor_telepon } =
    req.body;

  const emailExisted = await user.findOne({
    where: {
      email: email,
    },
  });

  if (emailExisted) {
    return res.status(409).json({
      status: false,
      msg: "Email already exists",
    });
  }
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    let userData = await user.create({
      username: username,
      password: hashPassword,
      nama_lengkap: nama_lengkap,
      alamat: alamat,
      email: email,
      nomor_telepon: nomor_telepon,
      isUser:'common-user'
    });

    userData = JSON.parse(JSON.stringify(userData));

    return res.status(200).json({
      success: true,
      message: "Register Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
    try {
      let userData = await user.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      userData = JSON.parse(JSON.stringify(userData));
  
      if (!userData) return res.status(400).json({ success: false, message: 'Email or Password did not match' });
      const match = await bcrypt.compare(req.body.password, userData.password);
      if (!match) return res.status(400).json({ success: false, message: 'Email or Password did not match' });
  
      // Token generation
      let refreshTokens = [];
  
      const userId = userData.id;
      const username = userData.username;
      const email = userData.email;
      const nama_lengkap = userData.nama_lengkap;
      const alamat = userData.alamat;
      const nomor_telepon = userData.nomor_telepon;
  
      const tokenParams = { userId, email, nama_lengkap, alamat, nomor_telepon };
  
      const accessToken = jwt.sign(tokenParams, 'access', {
        expiresIn: '1d',
      });
      const refreshToken = jwt.sign(tokenParams, 'refresh', {
        expiresIn: '30d',
      });
      refreshTokens.push(refreshToken);
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
      const expiresInDays = 1; // 1 day expiration for accessToken
      const refreshTokenExpiresInDays = 30; // 30 days expiration for refreshToken
  
      const data = {
        userId,
        username,
        email,
        nama_lengkap,
        alamat,
        nomor_telepon,
        accessToken,
        refreshToken,
        accessTokenExpiresIn: expiresInDays + ' day(s)',
        refreshTokenExpiresIn: refreshTokenExpiresInDays + ' day(s)',
      };
  
      return res.status(201).json({
        success: true,
        message: 'Login Successfully',
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ success: false, message: 'Login Failed' });
    }
  };