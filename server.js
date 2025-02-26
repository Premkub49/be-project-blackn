const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const dentists = require("./routes/dentists");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(`/api/v1/dentists`, dentists);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/auth", auth);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, " mode on port", PORT)
);

process.on("unhandleRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
