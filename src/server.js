require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const dotenv = require("dotenv");
const limiter = require("./middlewares/requestLimit");
const apiResponseHandler = require("./middlewares/responseHandler");
const errorHandler = require("./middlewares/errorHandler");
const authenticateToken = require("./middlewares/authenticateToken");

const appointmentRoutes = require("./routes/appointment.routes");
const slotsRoutes = require("./routes/slots.routes");
const authenticationRoutes = require("./routes/authentication.routes");
const userRoutes = require("./routes/user.route");
const dentistRoutes = require("./routes/dentist.routes");
// Load environment variables from .env file

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(limiter);

app.use(apiResponseHandler);

app.use("/api/appointment", authenticateToken, appointmentRoutes);
app.use("/api/slots", slotsRoutes);
app.use("/api/auth", authenticationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dentist", dentistRoutes);
app.use(errorHandler);

module.exports = app;
