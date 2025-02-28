const mongoose = require("mongoose");

const Log_Audit_BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: "Booking",
    required: true,
  },
  actionType: {
    type: String,
    enum: ["create", "edit", "delete", "error_input"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log_Audit_Booking", Log_Audit_BookingSchema);
