const shopController = require("../../controllers/shopController");
const { body } = require("express-validator");
const validation = require("../../handlers/validationHandler");
const Shop = require("../../models/Shop");
const router = require("express").Router();

router.get("/", shopController.gets);
router.get("/:id", shopController.get);
router.post(
  "/create",
  body("name").custom(async (name) => {
    const shop = await Shop.findOne({ name });
    if (shop) {
      throw new Error("Shop name is already used");
    }
  }),
  validation,
  shopController.create
);
router.put("/:id/follow", shopController.follow);
router.put("/:id", shopController.update);
router.patch("/:id", shopController.delete);

module.exports = router;
