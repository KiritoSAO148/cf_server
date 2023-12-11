const cartController = require("../../controllers/cartController");

const router = require("express").Router();

router.get("/:userId", cartController.getCart);
router.post("/:userId/add", cartController.addProductToCart);
router.put("/:userId/add/:productId", cartController.upCountProduct);
router.put("/:userId/remove/:productId", cartController.downCountProduct);
router.put("/:userId/product/:productId", cartController.removeProduct);

module.exports = router;
