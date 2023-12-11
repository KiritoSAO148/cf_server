const UnitController = require("../../controllers/unitController");
const router = require("express").Router();

router.get("/", UnitController.gets);
router.get("/:name", UnitController.get);
router.post("/", UnitController.create);
router.patch("/:id", UnitController.delete);

module.exports = router;
