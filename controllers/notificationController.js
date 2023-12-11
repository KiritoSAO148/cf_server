const { notificationHandler } = require("../handlers/notificationHandler");
const Notification = require("../models/Notification");

const notificationController = {
  gets: async (req, res) => {
    try {
      const notifications = await Notification.find().populate({
        path: "auth",
        model: "User",
        select: "_id fullname avatar",
      });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  get: async (req, res) => {
    try {
      const notifications = await Notification.find({
        send: {
          $elemMatch: {
            $eq: req.params.userId,
          },
        },
      }).sort({ createdAt: -1 });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  seen: async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(req.params.id, {
        seen: true,
      });
      if (!notification)
        return res.status(404).json({ message: "Notification not found" });
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  create: async (req, res) => {
    try {
      const newNotification = await Notification.create(req.body);
      const notification = await Notification.findById(
        newNotification._id
      ).populate({
        path: "auth",
        model: "User",
        select: "_id fullname avatar",
      });
      return res.status(201).json(notification);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    try {
      const notification = await Notification.findByIdAndUpdate(id, {
        status: req.body.status,
      });
      if (!notification) return res.status(404).json("Notification not found");
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(false);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const notification = await Notification.findByIdAndDelete(id);
      if (!notification) return res.status(404).json("Notification not found");
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(false);
    }
  },

  pushNotification: async (req, res) => {
    const { title, body } = req.body;
    try {
      await notificationHandler(title, body, token);
      return res
        .status(200)
        .json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error sending message" });
    }
  },
};

module.exports = notificationController;
