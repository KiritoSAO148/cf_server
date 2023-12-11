const favoriteController = require("../../controllers/favoriteController");

const router = require("express").Router();

router.get("/:userId", favoriteController.get);
router.post("/:userId/update/:productId", favoriteController.update);

module.exports = router;
