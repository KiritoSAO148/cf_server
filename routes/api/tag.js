const tagController = require("../../controllers/tagController");

const router = require("express").Router();

router.get("/", tagController.gets);
router.get("/:name", tagController.get);
router.post("/", tagController.create);
router.patch("/:id", tagController.delete);

module.exports = router;
