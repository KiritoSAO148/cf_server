const commentController = require("../../controllers/commentController");

const router = require("express").Router();

router.get("/:productId", commentController.getProductComments);
router.post("/product/:productId/user/:userId", commentController.addComment);
router.put("/:commentId/reaction", commentController.reactionComment);
router.patch("/:commentId", commentController.delete);

module.exports = router;
