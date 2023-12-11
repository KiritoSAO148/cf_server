const { validationResult } = require("express-validator");

const validation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  return res.status(400).send({ errors: result.array() });
};

module.exports = validation;
