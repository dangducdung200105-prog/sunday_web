const Court = require("../models/Court");
const Booking = require("../models/Booking");

const getCourtAvailability = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const court = await Court.findOne({
      _id: courtId,
      status: "ACTIVE",
      isApproved: true,
    });

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    const now = new Date();
    const bookings = await Booking.find({
      court: courtId,
      bookingDate: date,
      $or: [
        { status: "CONFIRMED" },
        { status: "PENDING", expiresAt: { $gt: now } },
      ],
    });

    const bookedSlots = new Set(bookings.map((booking) => booking.startTime));

    const slots = [];

    const startHour = parseInt(court.openingTime.split(":")[0], 10);

    const startMinute = parseInt(court.openingTime.split(":")[1], 10);

    const endHour = parseInt(court.closingTime.split(":")[0], 10);

    const endMinute = parseInt(court.closingTime.split(":")[1], 10);

    let currentMinutes = startHour * 60 + startMinute;

    const closingMinutes = endHour * 60 + endMinute;

    while (currentMinutes + court.slotDurationMinutes <= closingMinutes) {
      const nextMinutes = currentMinutes + court.slotDurationMinutes;

      const startTime = minutesToTime(currentMinutes);

      const endTime = minutesToTime(nextMinutes);

      slots.push({
        startTime,
        endTime,
        status: bookedSlots.has(startTime) ? "BOOKED" : "AVAILABLE",
      });

      currentMinutes = nextMinutes;
    }

    res.status(200).json({
      success: true,
      data: {
        court: {
          id: court._id,
          name: court.name,
          slotDurationMinutes: court.slotDurationMinutes,
        },
        date,
        slots,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
};

module.exports = {
  getCourtAvailability,
};
