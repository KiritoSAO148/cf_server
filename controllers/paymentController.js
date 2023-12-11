const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const config = require("config");
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
const paymentController = {
  visaMethod: async (req, res) => {
    const { amount } = req.body;
    try {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2023-08-16" }
      );
      const intent = await stripe.paymentIntents.create({
        amount,
        currency: "vnd",
        automatic_payment_methods: { enabled: true },
      });

      return res.status(200).json({
        client_secret: intent.client_secret,
        id: intent.id,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  createVnPayQRCode: async (req, res) => {
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";

      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");
      var orderId = moment(date).format("HHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = process.env.TMN_CODE;
      let secretKey = process.env.SECRET_KEY;
      let vnpUrl = process.env.VNP_URL;
      let returnUrl = process.env.RETURN_URL;
      let amount = req.body.amount;
      let bankCode = req.body.bankCode;

      let locale = req.body.language;
      if (locale === null || locale === "" || locale === undefined) {
        locale = "vn";
      }
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "" && locale !== undefined) {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      return res.status(200).json({ vnpUrl });
    } catch (error) {
      console.error("Error creating payment URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // paymentIpn: async (req, res) => {
  //   try {
  //     var vnp_Params = req.query;
  //     var secureHash = vnp_Params["vnp_SecureHash"];
  //     console.log(vnp_Params);

  //     delete vnp_Params["vnp_SecureHash"];
  //     delete vnp_Params["vnp_SecureHashType"];

  //     vnp_Params = sortObject(vnp_Params);
  //     var config = require("config");
  //     var secretKey = process.env.SECRET_KEY;
  //     var signData = querystring.stringify(vnp_Params, { encode: false });
  //     var hmac = crypto.createHmac("sha512", secretKey);
  //     var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  //     if (secureHash === signed) {
  //       var orderId = vnp_Params["vnp_TxnRef"];
  //       var rspCode = vnp_Params["vnp_ResponseCode"];
  //       res.status(200).json({ RspCode: "00", Message: "success" });
  //     } else {
  //       return res
  //         .status(200)
  //         .json({ RspCode: "97", Message: "Fail checksum" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json(error);
  //   }
  // },

  // vnpayReturn: async (req, res) => {
  //   try {
  //     var vnp_Params = req.query;

  //     var secureHash = vnp_Params["vnp_SecureHash"];

  //     delete vnp_Params["vnp_SecureHash"];
  //     delete vnp_Params["vnp_SecureHashType"];

  //     vnp_Params = sortObject(vnp_Params);

  //     var config = require("config");
  //     var tmnCode = process.env.TMN_CODE;
  //     var secretKey = process.env.SECRET_KEY;

  //     var signData = querystring.stringify(vnp_Params, { encode: false });
  //     var hmac = crypto.createHmac("sha512", secretKey);
  //     var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  //     if (secureHash === signed) {
  //       res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  //     } else {
  //       res.render("success", { code: "97" });
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     return res.status(500).json(error);
  //   }
  // },
};
module.exports = paymentController;
