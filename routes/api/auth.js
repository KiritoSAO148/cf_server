const { body } = require("express-validator");
const authController = require("../../controllers/authController");
const { verifyToken } = require("../../handlers/tokenHandler");
const validation = require("../../handlers/validationHandler");
const User = require("../../models/User");

const router = require("express").Router();

router.post("/login", authController.login);
router.post("/login/google", authController.google);
router.post("/login/facebook", authController.facebook);
router.post("/login/sms", authController.sms);
router.post(
  "/register",
  body("phone")
    .isLength({ min: 9, max: 11 })
    .withMessage("Số điện thoại không hợp lệ"),
  body("phone").custom(async (phone) => {
    const user = await User.findOne({ phone });
    if (user) {
      throw new Error("Số điện thoại đã được sử dụng để đăng ký");
    }
  }),
  body("email").custom(async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email đã được sử dụng để đăng ký");
    }
  }),
  body("username").custom(async (username) => {
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Tài khoản này đã được sử dụng để đăng ký");
    }
  }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu yêu cầu tối thiểu 8 kí tự"),
  validation,
  authController.register
);

router.post("/reset-password", authController.resetPassword);
router.post("/check-phone", authController.checkPhone);

router.post("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
