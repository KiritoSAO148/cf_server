const Category = require("../models/Category");

const categoryController = {
  create: async (req, res) => {
    try {
      const isExisted = await Category.findOne({ name: req.body.name });
      if (isExisted) {
        return res.status(400).json("Tên thể loại đã tồn tại");
      }
      const category = await Category.create(req.body);
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!category) {
        return res.status(400).json("Category not found");
      }
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  gets: async (req, res) => {
    try {
      const categories = await Category.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  get: async (req, res) => {
    try {
      const category = await Category.findOne({ name: req.params.name });
      if (!category) return res.status(400).json("Không tìm thấy tên thể loại");
      return res.status(200).json(category);
    } catch (error) {
      return res.status(200).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) return res.status(400).json("Không tìm thấy thể loại");
      return res.status(200).json("Đã xóa thành công");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = categoryController;
