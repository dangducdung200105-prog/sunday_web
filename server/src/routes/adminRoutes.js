const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  getAllOwners,
  getAllCourtsAdmin,
  approveCourt,
  rejectCourt,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Tất cả route admin đều yêu cầu đăng nhập + role ADMIN
router.use(authMiddleware, roleMiddleware("ADMIN"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Quản lý người dùng
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);

// Quản lý chủ sân
router.get("/owners", getAllOwners);

// Duyệt sân
router.get("/courts", getAllCourtsAdmin);
router.patch("/courts/:id/approve", approveCourt);
router.patch("/courts/:id/reject", rejectCourt);

// Quản lý đơn đặt sân
router.get("/bookings", getAllBookingsAdmin);
router.patch("/bookings/:id/status", updateBookingStatusAdmin);

module.exports = router;
