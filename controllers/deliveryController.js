const Delivery = require("../models/Delivery");

const deliveryController = {
  create: async (req, res) => {
    try {
      const delivey = await Delivery.findOne({ method: req.body.method });
      if (delivey)
        return res.status(400).json({ message: "Delivery mothod existed" });
      await Delivery.create(req.body);
      return res.status(201).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  gets: async (req, res) => {
    try {
      const methods = await Delivery.find();
      return res.status(200).json(methods);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  delete: async (req, res) => {
    try {
      await Delivery.findByIdAndDelete(req.params.id);
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = deliveryController;
