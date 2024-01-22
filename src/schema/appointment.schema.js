const { body, param } = require("express-validator");

const createAppointmentSchema = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("appointmentDate").isDate().withMessage("Date must be a valid date"),
  body("serviceType").notEmpty().withMessage("Service Type is required"),
  body("dentistId").notEmpty().withMessage("Dentist ID is required"),
  body("reason").optional().isString().withMessage("Reason must be a string"),
  body("specialNotes").optional().isString().withMessage("Special Notes must be a string"),
];

const getAppointmentSchema = [param("appointmentId").notEmpty().withMessage("Appointment ID is required")];

const updateAppointmentSchema = [body("appointmentId").notEmpty().withMessage("Appointment ID is required"), body("appointmentDate").isDate().withMessage("Date must be a valid date")];

const cancelAppointmentSchema = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("appointmentId").notEmpty().withMessage("Appointment ID is required"),
  body("status").notEmpty().withMessage("Status is required"),
];

const getAllAppointmentsSchema = [param("userId").notEmpty().withMessage("User ID is required")];

module.exports = {
  createAppointmentSchema,
  getAppointmentSchema,
  updateAppointmentSchema,
  cancelAppointmentSchema,
  getAllAppointmentsSchema,
};
