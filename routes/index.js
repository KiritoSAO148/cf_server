const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/auth", require("./api/auth"));
router.use("/users", require("./api/user"));
router.use("/categories", require("./api/category"));
router.use("/tags", require("./api/tag"));
router.use("/unit", require("./api/unit"));
router.use("/vouchers", require("./api/voucher"));
router.use("/news", require("./api/news"));
router.use("/products", require("./api/product"));
router.use("/shops", require("./api/shop"));
router.use("/orders", require("./api/order"));
router.use("/cart", require("./api/cart"));
router.use("/payment", require("./api/payment"));
router.use("/favorites", require("./api/favorite"));
router.use("/comments", require("./api/comment"));
router.use("/notifications", require("./api/notification"));
router.use("/settings", require("./api/settings"));
router.use("/messages", require("./api/message"));
router.use("/delivery", require("./api/delivery"));

router.use("/faq", require("./api/faq"));

module.exports = router;
