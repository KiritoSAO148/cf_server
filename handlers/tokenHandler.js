const jwt = require("jsonwebtoken");
const User = require("../models/User");

const tokenDecode = (req) => {
  const header = req.headers["authorization"];
  if (header) {
    const bearer = header.split(" ")[1];
    try {
      const tokenDecoded = jwt.verify(bearer, process.env.TOKEN_SECRET_KEY);
      return tokenDecoded;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};

exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id).select("-password");
    if (!user) return res.status(401).json("Unathorization");
    req.user = user;
    next();
  } else {
    return res.status(401).json("Unathorization");
  }
};
