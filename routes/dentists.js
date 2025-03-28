const express = require("express");
const {
  getDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
  getAllAreaDentists,
} = require("../controllers/dentists.js");
const bookingRouter = require("./bookings");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.js");
router.use("/:dentistId/bookings/", bookingRouter);
router
  .route("/")
  .get(getDentists)
  .post(protect, authorize("admin"), createDentist);
router.route("/area_of_expertise").get(getAllAreaDentists);
router
  .route("/:id(\\d+)")
  .get(getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);
module.exports = router;
