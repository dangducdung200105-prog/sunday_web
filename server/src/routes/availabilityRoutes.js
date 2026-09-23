const express = require("express");

const {
  getCourtAvailability,
} = require("../controllers/availabilityController");

const router = express.Router();

router.get("/courts/:courtId", getCourtAvailability);

module.exports = router;
