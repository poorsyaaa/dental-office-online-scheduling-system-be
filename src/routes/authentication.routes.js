// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validatorSchema");
const { registerUser, login, authenticateUser } = require("../controllers/authentication.controller");
const { registrationSchema, loginSchema, authenticateUserSchema } = require("../schema/authentication.schema");

router.post("/register", validate(registrationSchema), registerUser);
router.post("/login", validate(loginSchema), login);
router.get("/:token", validate(authenticateUserSchema), authenticateUser);

module.exports = router;
