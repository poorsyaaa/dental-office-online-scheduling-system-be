// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const getAllDentist = require("../controllers/dentistDetails.controller");

router.get("/", getAllDentist);

module.exports = router;
