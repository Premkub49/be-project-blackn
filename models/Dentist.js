const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plese add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    year_of_experience: {
      type: Number,
      required: [true, "Please add a year of experience"],
    },
    area_of_expertise: {
      type: String,
      required: [true, "Please add an area of expertise"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DentistSchema.virtual(`bookings`, {
  ref: `Booking`,
  localField: `_id`,
  foreignField: `dentist`,
  justOne: false,
});
module.exports = mongoose.model("Dentist", DentistSchema);
