const messageController = require("../../controllers/messageController");

const router = require("express").Router();

router.post("/send", messageController.send);
router.post("/:userId/ask-ai", messageController.ask);
router.get("/get/:from/:to", messageController.get);
router.get("/gets/:id", messageController.gets);

module.exports = router;
