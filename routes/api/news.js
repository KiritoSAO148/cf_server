const { body } = require("express-validator");
const newsController = require("../../controllers/newsController");
const validation = require("../../handlers/validationHandler");
const News = require("../../models/News");

const router = require("express").Router();

router.get("/", newsController.gets);
router.post(
  "/create",
  body("title").isLength({ min: 10, max: 100 }).withMessage("Invalid title"),
  body("content").isLength({ min: 50 }).withMessage("Invalid content"),
  validation,
  newsController.create
);
router.put("/:id/views", newsController.updateView);
router.put("/:id/like/:userId", newsController.updateLike);
router.put(
  "/:id",
  body("title").isLength({ min: 10, max: 100 }).withMessage("Invalid title"),
  body("content").isLength({ min: 50 }).withMessage("Invalid content"),
  validation,
  newsController.update
);
router.patch("/:id", newsController.delete);

module.exports = router;
