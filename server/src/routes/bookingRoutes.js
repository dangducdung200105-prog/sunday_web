const express = require("express");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
  getOwnerStatistics,
} = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Tạo booking
router.post("/", authMiddleware, createBooking);

// Lấy booking của user hiện tại
router.get("/my-bookings", authMiddleware, getMyBookings);

router.get(
  "/owner-bookings",
  authMiddleware,
  roleMiddleware("OWNER"),
  getOwnerBookings,
);

router.get(
  "/owner-statistics",
  authMiddleware,
  roleMiddleware("OWNER"),
  getOwnerStatistics,
);

// Xem một booking
router.get("/:id", authMiddleware, getBookingById);

// Hủy booking
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
