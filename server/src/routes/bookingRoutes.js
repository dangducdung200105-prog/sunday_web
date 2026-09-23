const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Tạo booking
router.post("/", authMiddleware, createBooking);

// Lấy booking của user hiện tại
router.get("/my-bookings", authMiddleware, getMyBookings);

// Xem một booking
router.get("/:id", authMiddleware, getBookingById);

// Hủy booking
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
