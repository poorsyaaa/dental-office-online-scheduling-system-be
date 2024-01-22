// src/routes/dentistRoutes.js
const express = require("express");
const router = express.Router();
const { listAvailableSlots } = require("../controllers/slots.controller");

// Route to get available slots for a dentist on a specific date
router.get("/:dentistId", listAvailableSlots);

module.exports = router;
