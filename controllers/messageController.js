const { OpenAI } = require("openai");
const Product = require("../models/Product");
const User = require("../models/User");
const Message = require("../models/Message");
const Settings = require("../models/Settings");
const CryptoJS = require("crypto-js");

const messageController = {
  ask: async (req, res) => {
    try {
      const products = await Product.find({ status: true }).select("title");
      const productNames = products.map((product) => product.title);
      const settings = await Settings.findOne();
      const apiKey = CryptoJS.AES.decrypt(
        settings.tokenGPT,
        process.env.TOKEN_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      const messages = [
        {
          role: "system",
          content: `Đây là cuộc trò chuyện về thương mại điện tử.`,
        },
        {
          role: "system",
          content: `Chỉ trả lời tên sản phẩm ở trong ${productNames.join(
            ", "
          )}`,
        },
        { role: "assistant", content: req.body.message },
      ];

      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
      });

      const aiResponse = response.choices;
      return res
        .status(200)
        .json({ fromSelf: false, message: aiResponse[0].message.content });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "An error occurred while processing your request.",
        error,
      });
    }
  },

  send: async (req, res) => {
    const { from, to, message } = req.body;
    try {
      const [checkSenderExisted, checkReveicerExisted] = await Promise.all([
        User.findById(from),
        User.findById(to),
      ]);
      if (!checkSenderExisted)
        return res.status(404).json({ message: "Sender not existed" });
      if (!checkReveicerExisted)
        return res.status(404).json({ message: "Reveicer not existed" });

      await Message.create({
        users: [from, to],
        message: {
          text: message.text,
          image: message.image,
        },
        sender: from,
      });

      return res.status(201).json({
        fromSelf: true,
        message: message?.text || message?.image,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  gets: async (req, res) => {
    try {
      const messages = await Message.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$sender",
            lastMessage: { $first: "$message" },
            users: { $first: "$users" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            userId: "$user._id",
            username: "$user.username",
            email: "$user.email",
            avatar: "$user.avatar",
            fullname: "$user.fullname",
            lastMessage: 1,
            users: 1,
            createdAt: 1,
          },
        },
      ]);
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  get: async (req, res) => {
    const { from, to } = req.params;
    try {
      const messages = await Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const messData = messages.map((mess) => {
        return {
          fromSelf: mess.sender.toString() === from,
          message: mess.message?.text || mess.message?.image,
        };
      });
      return res.status(200).json(messData);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = messageController;
