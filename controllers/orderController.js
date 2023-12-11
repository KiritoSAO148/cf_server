const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const tokensNotification = require("../models/tokensNotification");
const admin = require("firebase-admin");
const Notification = require("../models/Notification");
const sendMail = require("../handlers/sendMailHandler");

const orderController = {
  gets: async (req, res) => {
    const { userId } = req.params;
    try {
      const orders = await Order.findOne({ user: userId }).populate(
        "user",
        "-password"
      );
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  create: async (req, res) => {
    const { userId } = req.params;
    const { order } = req.body;
    try {
      let newOrder;
      const checkOrder = await Order.findOne({ user: userId });
      if (!checkOrder) {
        newOrder = await Order.create({
          user: userId,
          orders: [order],
        });
      } else {
        newOrder = await Order.findOneAndUpdate(
          { user: userId },
          {
            $push: {
              orders: order,
            },
          },
          { new: true }
        );
      }

      const newOrderInfo = newOrder.orders[newOrder.orders.length - 1];
      await Promise.all([
        await Cart.findOneAndDelete({ user: userId }),
        ...newOrderInfo.products.map(async (product) => {
          const productUpdated = await Product.findByIdAndUpdate(
            product._id,
            {
              $inc: { currentQuantity: -1, sold: +1 },
            },
            { new: true }
          );

          if (productUpdated.quantity <= 0) {
            productUpdated.status = false;
            await productUpdated.save();
          }
        }),
      ]);

      const { tokens } = await tokensNotification.findOne();

      const tokensResult = tokens
        .filter((data) => data.user.role === "admin")
        .flatMap((data) => data.tokens);

      await admin.messaging().sendEachForMulticast({
        notification: {
          title: "FreshGreen",
          body: "Có một đơn hàng mới",
        },
        tokens: tokensResult,
        data: {
          userId,
        },
      });

      const user = await User.findById(userId).select("email");

      await sendMail({
        title: "Đặt hàng thành công",
        content:
          "Đơn hàng của bạn đã được đặt thành công. Hãy truy cập https://freshgreen.vercel.app/quan-li-don-hang để kiểm tra ngay và theo dõi trạng thái của đơn hàng.",
        user: user.email,
      });

      return res.status(201).json(newOrderInfo);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  updateStatusOfOrder: async (req, res) => {
    const { userId, orderId } = req.params;
    const { status, message } = req.body;

    try {
      const updateData = { $set: { "orders.$.status": status } };

      const response = { orderId, status };
      if (message !== undefined) {
        updateData.$set["orders.$.message"] = message;
        response.message = message;
      }

      await Order.findOneAndUpdate(
        {
          user: userId,
          "orders._id": orderId,
        },
        updateData
      );

      const { tokens } = await tokensNotification.findOne();

      const userFiltered = tokens.find(
        (token) => token.user.userId.toString() === userId
      );

      if (userFiltered?.tokens && userFiltered?.tokens.length) {
        if (status === "access") {
          await admin.messaging().sendEachForMulticast({
            notification: {
              title: "FreshGreen",
              body: "Đơn hàng của bạn đã được xác nhận.",
            },
            tokens: userFiltered?.tokens,
          });
          await Notification.create({
            auth: req.body.adminId,
            title: "Đơn hàng",
            description: "Đơn hàng của bạn đã được xác nhận.",
            path: "OrderManager",
            status: true,
            send: [req.body.adminId, userId],
          });
        } else if (status === "refuse") {
          await admin.messaging().sendEachForMulticast({
            notification: {
              title: "FreshGreen",
              body: "Đơn hàng của bạn đã bị từ chối.",
            },
            tokens: userFiltered.tokens,
          });
          await Notification.create({
            auth: req.body.adminId,
            title: "Đơn hàng",
            description: "Đơn hàng của bạn đã bị từ chối.",
            path: "OrderManager",
            status: true,
            send: [req.body.adminId, userId],
          });
        }
      }

      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { userId, orderId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(401).json({ message: "User Not Found" });
      await Order.findOneAndDelete({ "orders._id": userId });
      return res
        .status(200)
        .json({ status: true, message: "Deleted order successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getOrders: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await User.findById(id);
      if (!admin || admin.role !== ("admin" || "superAdmin"))
        return res.status(401).json({ message: "You are not admin" });
      const orders = await Order.find().populate("user", "-password");
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = orderController;
