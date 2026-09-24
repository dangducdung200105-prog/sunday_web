const User = require("../models/User");
const Court = require("../models/Court");
const Booking = require("../models/Booking");

// ==================== DASHBOARD ====================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalAdmins,
      totalCourts,
      pendingCourts,
      approvedCourts,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "OWNER" }),
      User.countDocuments({ role: "ADMIN" }),
      Court.countDocuments(),
      Court.countDocuments({ isApproved: false }),
      Court.countDocuments({ isApproved: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "PENDING" }),
      Booking.countDocuments({ status: "CONFIRMED" }),
      Booking.countDocuments({ status: "CANCELLED" }),
      Booking.countDocuments({ status: "COMPLETED" }),
      Booking.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers + totalOwners + totalAdmins,
          customers: totalUsers,
          owners: totalOwners,
          admins: totalAdmins,
        },
        courts: {
          total: totalCourts,
          pending: pendingCourts,
          approved: approvedCourts,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
        },
        revenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== USERS ====================

const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change the status of your own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["USER", "OWNER", "ADMIN"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== OWNERS ====================

const getAllOwners = async (req, res) => {
  try {
    const owners = await User.aggregate([
      { $match: { role: "OWNER" } },
      {
        $lookup: {
          from: "courts",
          localField: "_id",
          foreignField: "owner",
          as: "courts",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          isActive: 1,
          createdAt: 1,
          courtCount: { $size: "$courts" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        owners,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== COURTS ====================

const getAllCourtsAdmin = async (req, res) => {
  try {
    const { isApproved, status, sportType } = req.query;

    const filter = {};

    if (isApproved !== undefined) filter.isApproved = isApproved === "true";
    if (status) filter.status = status;
    if (sportType) filter.sportType = sportType;

    const courts = await Court.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        courts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    court.isApproved = true;
    court.status = "ACTIVE";

    await court.save();

    res.status(200).json({
      success: true,
      message: "Court approved successfully",
      data: {
        court,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    court.isApproved = false;
    court.status = "INACTIVE";

    await court.save();

    res.status(200).json({
      success: true,
      message: "Court rejected successfully",
      data: {
        court,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== BOOKINGS ====================

const getAllBookingsAdmin = async (req, res) => {
  try {
    const { status, paymentStatus, courtId, userId } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (courtId) filter.court = courtId;
    if (userId) filter.user = userId;

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("court", "name address sportType owner")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    if (status === "CANCELLED" && booking.paymentStatus === "PAID") {
      booking.paymentStatus = "REFUNDED";
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
};
