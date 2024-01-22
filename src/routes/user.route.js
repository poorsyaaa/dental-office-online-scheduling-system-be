// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validatorSchema");
const getUserDetails = require("../controllers/user.controller");
const getUserDetailsSchema = require("../schema/user.schema");

router.get("/:userId", validate(getUserDetailsSchema), getUserDetails);

module.exports = router;
