const { body, param } = require("express-validator");

const registrationSchema = [
  body("userName").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("firstName").notEmpty().withMessage("Firstname is required"),
  body("lastName").notEmpty().withMessage("Lastname is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
];

const loginSchema = [body("userName").notEmpty().withMessage("Username is required"), body("password").notEmpty().withMessage("Password is required")];

const authenticateUserSchema = [param("token").notEmpty().withMessage("Token is required")];

module.exports = {
  registrationSchema,
  loginSchema,
  authenticateUserSchema,
};
