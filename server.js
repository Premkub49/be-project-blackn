const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const dentists = require("./routes/dentists");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const logs = require("./routes/log_audit_booking");
const connectDB = require("./config/db");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
});
app.use(limiter);
app.use(hpp());
app.use(cors());

app.use(`/api/v1/dentists`, dentists);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/auth", auth);
app.use("/api/v1/logs", logs);
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV == "deployment") {
  module.exports = (req, res) => {
    app(req, res);
  };
} else if (process.env.NODE_ENV == "development") {
  app.listen(
    PORT,
    console.log(
      "Server running in ",
      process.env.NODE_ENV,
      " mode on port",
      PORT
    )
  );
}

process.on("unhandleRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
