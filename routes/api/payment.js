const paymentController = require("../../controllers/paymentController");

const router = require("express").Router();

router.post("/secret", paymentController.visaMethod);

router.post("/vnpay", paymentController.createVnPayQRCode);
// router.get("/vnpay_ipn", paymentController.paymentIpn);
// router.get("/vnpay_return", paymentController.vnpayReturn);

module.exports = router;
