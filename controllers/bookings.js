const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");
const LogAuditBooking = require("../models/Log_Audit_Booking");

exports.getBookings = async (req, res, next) => {
  let query;
  let populateDentist = {
    path: "dentist",
    select: "name year_of_experience area_of_expertise",
  };
  let populateUser = {
    path: "user",
    select: "name email tel role",
  };
  if (req.user.role !== "admin") {
    query = await Booking.find({ user: req.user.id }).populate(populateDentist);
  } else {
    if (req.params.dentistId) {
      console.log(req.params.dentistId);
      query = await Booking.find({ dentist: req.params.dentistId })
        .populate(populateDentist)
        .populate(populateUser);
    } else {
      if (req.query.user) {
        query = await Booking.find({ user: req.query.user })
          .populate(populateDentist)
          .populate(populateUser);
      } else {
        query = await Booking.find()
          .populate(populateDentist)
          .populate(populateUser);
      }
    }
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "dentist",
      select: "name year_of_experience area_of_expertise",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    if (req.params.dentistId !== undefined) {
      req.body.dentist = req.params.dentistId;
    }
    const dentist = await Dentist.findById(req.body.dentist);
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with the id of ${req.body.dentist}`,
      });
    }
    req.body.user = req.user.id;
    const existedBooking = await Booking.find({ user: req.user.id });
    if (existedBooking.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made booking`,
      });
    }
    const booking = await Booking.create(req.body);

    // Create Log Audit Booking
    const logAuditBooking = await LogAuditBooking.create({
      user: req.user.id,
      booking: booking._id,
      actionType: "create",
    });
    console.log("Add new booking\n", logAuditBooking);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot create Booking",
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Create Log Audit Booking
    const logAuditBooking = await LogAuditBooking.create({
      user: req.user.id,
      booking: booking._id,
      actionType: "edit",
    });
    console.log("Update booking\n", logAuditBooking);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }
    await booking.deleteOne();

    // Create Log Audit Booking
    const logAuditBooking = await LogAuditBooking.create({
      user: req.user.id,
      booking: booking._id,
      actionType: "delete",
    });
    console.log("Delete booking\n", logAuditBooking);

    res.status(200).json({
      success: true,
      date: {},
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Booking",
    });
  }
};
