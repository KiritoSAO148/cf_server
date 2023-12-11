const Order = require("../models/Order");
const Product = require("../models/Product");
const _ = require("lodash");

const productController = {
  gets: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage);
      const startIndex = (page - 1) * perPage;

      const category = req.query.category
        ? req.query.category.split(",")
        : undefined;

      const limit = req.query.limit ? req.query.limit.split(",")[0] : undefined;
      const shop = req.query.shop ? req.query.shop.split(",") : undefined;

      const minPrice = req.query.minPrice
        ? parseInt(req.query.minPrice)
        : undefined;
      const maxPrice = req.query.maxPrice
        ? parseInt(req.query.maxPrice)
        : undefined;

      const filter = {};
      if (category) filter.category = { $in: category };
      if (shop) filter.shop = { $in: shop };
      if (minPrice) filter.lastPrice = { $gte: minPrice };
      if (maxPrice) filter.lastPrice = { ...filter.price, $lte: maxPrice };

      let totalProducts;
      totalProducts = await Product.countDocuments({ status: true });
      let products;
      if (limit === "admin") {
        totalProducts = await Product.countDocuments();
        products = await Product.find({ ...filter })
          .skip(startIndex)
          .limit(perPage || totalProducts)
          .populate({
            path: "shop",
            model: "Shop",
            select: "name user",
            populate: {
              path: "user",
              model: "User",
              select: "avatar",
            },
          });
      } else {
        totalProducts = await Product.countDocuments({ status: true });
        products = await Product.find({ ...filter, status: true })
          .skip(startIndex)
          .limit(perPage || totalProducts)
          .populate({
            path: "shop",
            model: "Shop",
            select: "name user",
            populate: {
              path: "user",
              model: "User",
              select: "avatar",
            },
          });
      }

      return res.status(200).json({ products, page, perPage, totalProducts });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  get: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate([
        {
          path: "shop",
          model: "Shop",
          select: "name user",
          populate: {
            path: "user",
            model: "User",
            select: "avatar",
          },
        },
        {
          path: "comments",
        },
      ]);
      if (!product) {
        return res.status(400).json("Product not found");
      }

      const comments = product.comments;
      const averageStarRating = comments.reduce((acc, v) => {
        return (acc + v.rate) / comments.length;
      }, 0);
      await product.updateOne({ averageStarRating });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(200).json(error);
    }
  },
  create: async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);
      const product = await Product.findById(newProduct._id).populate({
        path: "shop",
        model: "Shop",
        select: "name user",
        populate: {
          path: "user",
          model: "User",
          select: "avatar",
        },
      });
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    try {
      const isExisted = await Product.findById(req.body._id);
      if (!isExisted)
        return res.status(404).json({ message: "Product not found" });

      const isExistedTitle = await Product.findOne({ title: req.body.title });
      if (isExistedTitle._id === req.params.id) {
        return res.status(400).json({
          erros: [
            {
              path: "title",
              msg: "Title already used",
            },
          ],
        });
      }
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!product) {
        return res.status(400).json("Product not found");
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(200).json(error);
    }
  },
  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(400).json("Product not found");
      }
      return res.status(200).json("Product deleted successfully");
    } catch (error) {
      return res.status(200).json(error);
    }
  },

  shopProducts: async (req, res) => {
    try {
      const page = req.query.page || 1;
      const perPage = req.query.perPage;
      const start = (page - 1) * perPage;
      const totalProducts = await Product.countDocuments({
        shop: req.params.id,
      });
      const products = await Product.find({ shop: req.params.id, status: true })
        .skip(start)
        .limit(perPage || totalProducts);
      return res.status(200).json({ products, totalProducts, page, perPage });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateView: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { views: 1 },
        },
        { new: true }
      );
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  productsView: async (req, res) => {
    try {
      const products = await Product.find({ status: true }).limit(8);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  popularProducts: async (req, res) => {
    try {
      const products = await Product.find({
        views: { $exists: true },
        "favorites.length": { $exists: true },
        sold: { $exists: true },
        "comments.length": { $exists: true },
        status: true,
      })
        .sort({
          views: -1,
          "favorites.length": -1,
          sold: -1,
          "comments.length": -1,
        })
        .limit(8);

      if (!products.length) {
        const currentProducts = await Product.find().limit(8);
        return res.status(200).json(currentProducts);
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  bestSellerProducts: async (req, res) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    try {
      const bestSellers = await Order.aggregate([
        {
          $match: {
            "orders.status": "done",
            "orders.createdAt": {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          },
        },
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.status": "done",
            "orders.createdAt": {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          },
        },
        {
          $unwind: "$orders.products",
        },
        {
          $lookup: {
            from: "products", // Tên của collection chứa thông tin sản phẩm
            localField: "orders.products._id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $match: {
            "product.status": true, // Chỉ lấy sản phẩm có status true
          },
        },
        {
          $group: {
            _id: "$orders.products._id",
            product: { $first: "$product" },
            totalSales: { $sum: 1 },
          },
        },
        {
          $sort: {
            totalSales: -1,
          },
        },
        {
          $limit: 8,
        },
      ]);

      const bestSellingProducts = bestSellers.map((item) => ({
        ...item.product,
        totalSales: item.totalSales,
      }));
      return res.status(200).json(bestSellingProducts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  dealOfDayProducts: async (req, res) => {
    try {
    } catch (error) {}
  },

  ratedHighted: async (req, res) => {
    try {
      const products = await Product.find({ status: true })
        .sort({ averageStarRating: -1 })
        .limit(8);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  newProducts: async (req, res) => {
    try {
      const products = await Product.find({ status: true })
        .sort({ createdAt: -1 })
        .limit(8);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  biggestDiscount: async (req, res) => {
    try {
      const products = await Product.find({ status: true })
        .sort({ discount: -1 })
        .limit(8);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  search: async (req, res) => {
    const { product } = req.query;
    try {
      const products = await Product.find({ status: true });
      const productResult =
        product === "" || product === undefined
          ? []
          : products.filter((data) =>
              data.title.toLowerCase().includes(product.toLowerCase())
            );
      return res.status(200).json(productResult);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = productController;
