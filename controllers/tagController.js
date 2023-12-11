const Tag = require("../models/Tag");

const tagController = {
  gets: async (req, res) => {
    try {
      const tags = await Tag.find();
      return res.status(200).json(tags);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  get: async (req, res) => {
    try {
      const tag = await Tag.findOne({ name: req.params.name });
      if (!tag) return res.status(400).json("Tag not found");
      return res.status(200).json(tag);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    try {
      const isExisted = await Tag.findOne({ name: req.body.name });
      if (isExisted) return res.status(400).json("Tag already existed");
      const tag = await Tag.create(req.body);
      return res.status(201).json(tag);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  delete: async (req, res) => {
    try {
      const tag = await Tag.findByIdAndDelete(req.params.id);
      if (!tag) return res.status(400).json("Tag not found");
      return res.status(200).json("Tag created successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = tagController;
