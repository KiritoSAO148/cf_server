const Voucher = require("../models/Voucher");

const voucherController = {
  gets: async (req, res) => {
    try {
      const vouchers = await Voucher.find();
      return res.status(200).json(vouchers);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  get: async (req, res) => {
    try {
      const voucher = await Voucher.findOne({ voucher: req.params.voucher });
      if (!voucher) return res.status(400).json({ error: "Voucher not found" });
      const currentDate = new Date();
      await Voucher.deleteMany({ lastDate: { $lt: currentDate } });
      return res.status(200).json(voucher);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  create: async (req, res) => {
    try {
      await Voucher.create({
        voucher: req.body.voucher,
        author: req.body.author,
        discount: req.body.discount,
        lastDate: req.body.lastDate,
      });
      return res.status(200).json("Đã tạo mã giảm giá thành công");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!voucher) return res.status(400).json("Voucher not found");
      return res.status(200).json(voucher);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      const voucher = await Voucher.findByIdAndDelete(req.params.id);
      if (!voucher) return res.status(400).json("Voucher not found");
      return res.status(200).json("Voucher deleted successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = voucherController;
