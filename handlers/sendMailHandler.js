const Settings = require("../models/Settings");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const sendMail = async ({ title, content, user }) => {
  const emailPort = await Settings.findOne().select("emailSendPort");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailPort.emailSendPort.email,
      pass: CryptoJS.AES.decrypt(
        emailPort.emailSendPort.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8),
    },
  });

  const mailOptions = {
    from: "FreshGreen",
    to: user,
    subject: title,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
  });
};

module.exports = sendMail;
