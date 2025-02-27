const LogAuditBooking = require("../models/Log_Audit_Booking");

exports.getLogs = async (req, res, next) => {
   try {
      const logs = await LogAuditBooking.find();
      res.status(200).json({
         success: true,
         count: logs.length,
         data: logs,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "Cannot find logs",
      });
   }
};

exports.getLog = async (req, res, next) => {
   try {
      const log = await LogAuditBooking.findById(req.params.id);
      if (!log) {
         return res.status(404).json({
            success: false,
            message: `No log with the id of ${req.params.id}`,
         });
      }
      res.status(200).json({
         success: true,
         data: log,
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         success: false,
         message: "Cannot find log",
      });
   }
};

exports.deleteLog = async (req, res, next) => {
   try {
      const log = await LogAuditBooking.findById(req.params.id);
      if (!log) {
         return res.status(404).json({
            success: false,
            message: `No log with the id of ${req.params.id}`,
         });
      }
      log.remove();
      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         success: false,
         message: "Cannot delete log",
      });
   }
};