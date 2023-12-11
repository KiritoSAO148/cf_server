const deliveryController = require("../../controllers/deliveryController");

const router = require("express").Router();

router.get("/", deliveryController.gets);
router.post("/", deliveryController.create);
router.delete("/:id", deliveryController.delete);

module.exports = router;
