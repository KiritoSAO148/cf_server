const Cart = require("../models/Cart");

const cartController = {
  getCart: async (req, res) => {
    try {
      const userCart = await Cart.findOne({ user: req.params.userId });
      return res.status(200).json(userCart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  addProductToCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.params.userId });
      if (!cart) {
        const { product } = req.body;
        const newCart = {
          user: req.params.userId,
          products: [product],
        };

        await Cart.create(newCart);
        return res.status(201).json("Product added to cart successfully");
      }

      const checkProductExisted = await Cart.findOne({
        user: req.params.userId,
        "products._id": req.body.product._id,
      });

      if (checkProductExisted) {
        await Cart.findOneAndUpdate(
          {
            user: req.params.userId,
            "products._id": req.body.product._id,
          },
          {
            $inc: { "products.$.count": 1 },
          }
        );
        return res.status(200).json("Product added to cart successfully");
      }

      await Cart.findByIdAndUpdate(cart._id, {
        $push: { products: req.body.product },
      });

      return res.status(200).json("Product added to cart successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  upCountProduct: async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        {
          user: req.params.userId,
          "products._id": req.params.productId,
        },
        {
          $inc: { "products.$.count": 1 },
        }
      );

      if (!cart) return res.status(404).json({ error: "Cart not found" });
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(false);
    }
  },

  downCountProduct: async (req, res) => {
    const { userId, productId } = req.params;
    try {
      const updateQuery = {
        user: userId,
        "products._id": productId,
      };
      const cart = await Cart.findOneAndUpdate(updateQuery, {
        $inc: { "products.$.count": -1 },
      });

      await Cart.findOneAndUpdate(
        {
          ...updateQuery,
          "products.count": 0,
        },
        {
          $pull: {
            products: {
              _id: productId,
            },
          },
        }
      );

      if (!cart) return res.status(400).json({ error: "Cart not found" });
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(false);
    }
  },

  removeProduct: async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { user: req.params.userId },
        {
          $pull: {
            products: {
              _id: req.params.productId,
            },
          },
        }
      );
      if (!cart) return res.status(400).json({ error: "Cart not found" });
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = cartController;
