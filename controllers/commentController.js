const Comment = require("../models/Comment");
const Product = require("../models/Product");

const commentController = {
  getProductComments: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId).select("comments");

      if (!product) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const populatedProduct = await product.populate([
        {
          path: "comments",
          model: "Comment",
          populate: {
            path: "auth",
            model: "User",
            select: "-password",
          },
        },
        {
          path: "comments.replies",
          model: "Comment",
          populate: {
            path: "auth",
            model: "User",
            select: "-password",
          },
        },
      ]);

      const comments = populatedProduct.comments;

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  addComment: async (req, res) => {
    const { content, commentId, rate } = req.body;
    const { productId, userId } = req.params;
    try {
      let newComment = await Comment.create({
        auth: userId,
        content,
        rate,
      });

      if (!commentId) {
        await Product.findByIdAndUpdate(productId, {
          $push: {
            comments: newComment._id,
          },
        });

        newComment = await newComment.populate({
          path: "auth",
          model: "User",
          select: "-password",
        });

        return res.status(201).json(newComment);
      }

      const commentUpdated = await Comment.findByIdAndUpdate(commentId, {
        $push: {
          replies: newComment._id,
        },
      });

      const comment = await commentUpdated.populate([
        {
          path: "auth",
          model: "User",
          select: "-password",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "auth",
            model: "User",
            select: "-password",
          },
        },
      ]);

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  reactionComment: async (req, res) => {
    const { commentId } = req.params;
    const { auth, reaction } = req.body;
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (reaction === "Like") {
        await comment.updateOne({
          $push: {
            reaction: auth,
          },
        });
      } else {
        await comment.updateOne({
          $pull: {
            reaction: auth,
          },
        });
      }

      return res.status(200).json({ commentId, reaction, auth });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { commentId } = req.params;
    const { productId } = req.body;
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await Promise.all([
        Comment.findByIdAndDelete(commentId),
        product.updateOne({
          $pull: {
            comments: commentId,
          },
        }),
      ]);

      return res.status(200).json({ commentId });
    } catch (error) {}
  },
};

module.exports = commentController;
