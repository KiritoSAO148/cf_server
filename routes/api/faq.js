const faqController = require("../../controllers/faqController");

const router = require("express").Router();

router.get("/", faqController.get);

module.exports = router;
