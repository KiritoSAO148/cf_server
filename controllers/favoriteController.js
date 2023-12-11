const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

const favoriteController = {
  get: async (req, res) => {
    const { userId } = req.params;
    try {
      const favorites = await Favorite.findOne({ user: userId }).populate(
        "products.product"
      );

      return res.status(200).json(favorites);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    const { userId, productId } = req.params;

    try {
      const favoriteExisted = await Favorite.findOne({ user: userId });

      if (!favoriteExisted) {
        await Favorite.create({
          user: userId,
          products: [{ product: productId }],
        });
      } else {
        const query = { user: userId, "products.product": productId };
        const checkFavoriteProduct = await Favorite.findOne(query);

        if (!checkFavoriteProduct) {
          await Promise.all([
            Favorite.findOneAndUpdate(
              { user: userId },
              {
                $push: {
                  products: { product: productId },
                },
              }
            ),
            Product.findByIdAndUpdate(productId, {
              $push: {
                favorites: userId,
              },
            }),
          ]);
        } else {
          await Promise.all([
            Favorite.updateOne(
              {
                user: userId,
              },
              {
                $pull: {
                  products: { product: productId },
                },
              }
            ),
            Product.findByIdAndUpdate(productId, {
              $pull: {
                favorites: userId,
              },
            }),
          ]);
        }
      }
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = favoriteController;
