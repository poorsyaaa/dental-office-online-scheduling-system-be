const { param } = require("express-validator");

const getUserDetailsSchema = [param("userId").notEmpty().withMessage("User ID is required")];

module.exports = getUserDetailsSchema;
