const Dentist = require("../models/Dentist.js");
const Booking = require("../models/Booking.js");
exports.getDentists = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    //console.log(reqQuery);
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    console.log(queryStr);
    query = Dentist.find(JSON.parse(queryStr)).populate(`bookings`);
    if (req.query.name) {
      let fields = req.query.area_of_expertise.split(",");
      query = query.find({
        name: { $in: fields },
      });
    }
    if (req.query.area_of_expertise) {
      let fields = req.query.area_of_expertise.split(",");
      console.log(fields);
      query = query.find({
        area_of_expertise: { $in: fields },
      });
    }
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await query.clone().countDocuments();
    query = query.skip(startIndex).limit(limit);
    const dentists = await query;
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    pagination.total = { page: Math.ceil(total / limit) };
    res.status(200).json({
      success: true,
      count: dentists.length,
      pagination,
      data: dentists,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getAllAreaDentists = async (req, res, next) => {
  try {
    const area_of_expertise = await Dentist.find()
      .select({
        _id: 0,
        area_of_expertise: 1,
      })
      .distinct("area_of_expertise");
    // console.log(area_of_expertise);
    if (!area_of_expertise) {
      return res
        .status(404)
        .json({ success: false, message: `No area of expertise found` });
    }
    const total = area_of_expertise.length;

    res
      .status(200)
      .json({ success: true, count: total, data: area_of_expertise });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

exports.createDentist = async (req, res, next) => {
  const dentist = await Dentist.create(req.body);
  res.status(201).json({ success: true, data: dentist });
};

exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dentist) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `Dentist not found with id of ${req.params.id}`,
      });
    }
    await Booking.deleteMany({ dentist: req.params.id });
    await Dentist.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
