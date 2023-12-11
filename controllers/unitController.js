const Unit = require("../models/Unit");

const UnitController = {
  gets: async (req, res) => {
    try {
      const units = await Unit.find();
      return res.status(200).json(units);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  get: async (req, res) => {
    try {
      const unit = await Unit.findOne({ name: req.params.name });
      if (!unit) return res.status(400).json("Unit not found");
      return res.status(200).json(unit);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    try {
      const isExisted = await Unit.findOne({ name: req.body.name });
      if (isExisted) return res.status(400).json("Unit already existed");
      const unit = await Unit.create(req.body);
      return res.status(201).json(unit);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  delete: async (req, res) => {
    try {
      const unit = await Unit.findByIdAndDelete(req.params.id);
      if (!unit) return res.status(400).json("Unit not found");
      return res.status(200).json("Unit created successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = UnitController;
