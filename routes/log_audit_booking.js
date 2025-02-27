const express = require("express");
const {
   getLogs,
   getLog,
   deleteLog
} = require("../controllers/log_audit_booking");
const router = express.Router();
const {
   protect,
   authorize
} = require("../middleware/auth.js");

router
   .route("/")
   .get(protect, authorize("admin"), getLogs);
router
   .route("/:id")
   .get(protect, authorize("admin"), getLog)
   .delete(protect, authorize("admin"), deleteLog);

module.exports = router;