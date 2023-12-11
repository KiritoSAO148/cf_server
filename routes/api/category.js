const categoryController = require("../../controllers/categoryController");

const router = require("express").Router();

router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.patch("/:id", categoryController.delete);
router.get("/", categoryController.gets);
router.get("/:name", categoryController.get);

module.exports = router;
