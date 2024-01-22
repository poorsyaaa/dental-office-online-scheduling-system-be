const { validationResult } = require("express-validator");

const validate = (schemas) => {
  return [
    ...schemas,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.apiError({
          error: errors.array(),
          message: "Validation failed",
          statusCode: 400,
        });
      }
      next();
    },
  ];
};

module.exports = validate;
