const Booking = require("../models/Booking");
const Court = require("../models/Court");
const {
  isValidTimeFormat,
  isValidDateFormat,
  isPastDate,
} = require("../utils/bookingValidation");
// ==================== CREATE BOOKING ====================

const createBooking = async (req, res) => {
  try {
    const { courtId, bookingDate, startTime, endTime } = req.body;
    if (!isValidDateFormat(bookingDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date format",
      });
    }

    if (isPastDate(bookingDate)) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:mm",
      });
    }
    // 1. Validate input
    if (!courtId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "courtId, bookingDate, startTime and endTime are required",
      });
    }

    // 2. Tìm sân
    const court = await Court.findOne({
      _id: courtId,
      status: "ACTIVE",
      isApproved: true,
    });

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found or unavailable",
      });
    }

    // 3. Kiểm tra slot có hợp lệ với giờ hoạt động không
    const isValidSlot = checkValidSlot(court, startTime, endTime);

    if (!isValidSlot) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking time slot",
      });
    }

    // 4. Kiểm tra booking đã tồn tại
    const existingBooking = await Booking.findOne({
      court: courtId,
      bookingDate,
      startTime,
      status: {
        $in: ["PENDING", "CONFIRMED"],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // 5. Tính giá ở backend
    const durationHours = getDurationInHours(startTime, endTime);

    const price = court.pricePerHour * durationHours;

    // 6. Tạo booking
    const booking = await Booking.create({
      user: req.user._id,
      court: courtId,
      bookingDate,
      startTime,
      endTime,
      price,
    });

    // 7. Trả response
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET MY BOOKINGS ====================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("court", "name address sportType")
      .sort({ bookingDate: -1 });

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

// ==================== GET BOOKING BY ID ====================

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("court", "name address sportType pricePerHour");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
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

// ==================== CANCEL BOOKING ====================

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.status = "CANCELLED";

    if (booking.paymentStatus === "PAID") {
      booking.paymentStatus = "REFUNDED";
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
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

// ==================== HELPERS ====================

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const getDurationInHours = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return (end - start) / 60;
};

const checkValidSlot = (court, startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  const opening = timeToMinutes(court.openingTime);

  const closing = timeToMinutes(court.closingTime);

  // Phải nằm trong giờ mở cửa
  if (start < opening || end > closing) {
    return false;
  }

  // end phải lớn hơn start
  if (end <= start) {
    return false;
  }

  // Đúng duration của sân
  if (end - start !== court.slotDurationMinutes) {
    return false;
  }

  // Slot phải bắt đầu đúng theo khoảng slot
  if ((start - opening) % court.slotDurationMinutes !== 0) {
    return false;
  }

  return true;
};

const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "court",
        match: {
          owner: req.user._id,
        },
        select: "name address sportType",
      })
      .populate("user", "name email phone")
      .sort({
        bookingDate: -1,
        startTime: -1,
      });

    // Vì populate match có thể trả court = null
    const ownerBookings = bookings.filter((booking) => booking.court !== null);

    res.status(200).json({
      success: true,
      data: {
        bookings: ownerBookings,
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
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
};
