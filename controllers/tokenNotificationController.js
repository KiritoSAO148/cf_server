const TokensNotification = require("../models/tokensNotification");
const User = require("../models/User");

const tokenNotificationController = {
  pushToken: async (req, res) => {
    try {
      const { token, id, platform } = req.body;

      let tokensNotification = await TokensNotification.findOne();

      if (!tokensNotification) {
        tokensNotification = await TokensNotification.create({
          tokens: [],
          devices: { mobile: [], web: [] },
        });
      }

      const { tokens, devices } = tokensNotification;

      if (platform === "mobile" && !devices.mobile.includes(token)) {
        devices.mobile.push(token);
      } else if (platform === "web" && !devices.web.includes(token)) {
        devices.web.push(token);
      }

      let userFound = false;

      tokens.forEach((userTokens) => {
        if (userTokens.user.userId.toString() === id) {
          userFound = true;
          const userTokenIndex = userTokens.tokens.findIndex(
            (t) => t === token
          );
          if (userTokenIndex !== -1) {
            userTokens.tokens[userTokenIndex] = token; // Thay thế token
          }
        }
      });

      if (!userFound) {
        const user = await User.findById(id);
        if (user) {
          tokens.push({
            tokens: [token],
            user: {
              userId: user._id,
              role: user.role,
              platform: platform,
            },
          });
        }
      }

      await tokensNotification.save();

      return res.status(200).json(true);
    } catch (error) {
      console.error("Error adding token to notifications:", error);
      return res.status(500).json(error);
    }
  },
  slice: async (req, res) => {
    try {
      const token = req.body.token;
      const tokensNotification = await TokensNotification.findOne();
      const index = tokensNotification.tokens.indexOf(token);
      if (index !== -1) {
        tokensNotification.tokens.splice(index, 1);
        await tokensNotification.save();
        console.log("Token removed from notifications:", token);
      } else {
        console.log("Token not found in notifications:", token);
      }

      return res.status(200).json(true);
    } catch (error) {
      return res.status(200).json(error);
    }
  },
};

module.exports = tokenNotificationController;
