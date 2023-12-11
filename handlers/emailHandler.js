const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const host = "https://freshgreen.vercel.app";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e6d4b84f96d0c4",
    pass: "54b351db067740",
  },
});
// var transport = nodemailer.createTransport({
//   host: "live.smtp.mailtrap.io",
//   port: 587,
//   auth: {
//     user: "api",
//     pass: "9595c074b18abb38cc65f3472896f541"
//   }
// });
const generateVerificationToken = () => {
  const token = CryptoJS.SHA256(Math.random().toString()).toString(
    CryptoJS.enc.Hex
  );
  return token;
};

module.exports = {
  transporter,
  generateVerificationToken,
  host,
};
