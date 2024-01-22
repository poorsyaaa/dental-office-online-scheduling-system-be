// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validatorSchema");
const { createAppointment, getAppointment, updateAppointment, cancelAppointment, getAllAppointments } = require("../controllers/appointment.controller");
const { createAppointmentSchema, getAppointmentSchema, updateAppointmentSchema, cancelAppointmentSchema, getAllAppointmentsSchema, getUserDetailsSchema } = require("../schema/appointment.schema");

router.post("/", validate(createAppointmentSchema), createAppointment);
router.get("/:appointmentId", validate(getAppointmentSchema), getAppointment);
router.get("/user/:userId", validate(getAllAppointmentsSchema), getAllAppointments);
router.put("/", validate(updateAppointmentSchema), updateAppointment);
router.put("/cancel", validate(cancelAppointmentSchema), cancelAppointment);

module.exports = router;
