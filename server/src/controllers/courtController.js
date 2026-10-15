const Court = require("../models/Court");

// ==================== CREATE ====================

const createCourt = async (req, res) => {
  try {
    const {
      name,
      description,
      sportType,
      address,
      pricePerHour,
      slotDurationMinutes,
      openingTime,
      closingTime,
      images,
      amenities,
      location,
    } = req.body;

    if (
      !name ||
      !sportType ||
      !address ||
      pricePerHour === undefined ||
      !openingTime ||
      !closingTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required court information",
      });
    }

    const court = await Court.create({
      owner: req.user._id,
      name,
      description,
      sportType,
      address,
      pricePerHour,
      slotDurationMinutes,
      openingTime,
      closingTime,
      images,
      location,
      amenities,
    });

    res.status(201).json({
      success: true,
      message: "Court created successfully",
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

// ==================== GET ALL ====================

const getCourts = async (req, res) => {
  try {
    const courts = await Court.find({
      status: "ACTIVE",
      isApproved: true,
    }).populate("owner", "name email");

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

// ==================== GET ONE ====================

const getCourtById = async (req, res) => {
  try {
    const court = await Court.findOne({
      _id: req.params.id,
      status: "ACTIVE",
      isApproved: true,
    }).populate("owner", "name email");

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    res.status(200).json({
      success: true,
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

// ==================== UPDATE ====================

const updateCourt = async (req, res) => {
  try {
    const court = await Court.findOne({
      _id: req.params.id,
      status: "ACTIVE",
    });

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    // Chỉ OWNER tạo ra sân này mới được sửa
    if (court.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courts",
      });
    }

    const {
      name,
      description,
      sportType,
      address,
      pricePerHour,
      location,
      openingTime,
      closingTime,
      images,
      amenities,
      status,
    } = req.body;

    if (name !== undefined) court.name = name;
    if (description !== undefined) court.description = description;
    if (sportType !== undefined) court.sportType = sportType;
    if (address !== undefined) court.address = address;
    if (location !== undefined) court.location = location;
    if (pricePerHour !== undefined) court.pricePerHour = pricePerHour;
    if (openingTime !== undefined) court.openingTime = openingTime;
    if (closingTime !== undefined) court.closingTime = closingTime;
    if (images !== undefined) court.images = images;
    if (amenities !== undefined) court.amenities = amenities;
    if (status !== undefined) court.status = status;

    await court.save();

    res.status(200).json({
      success: true,
      message: "Court updated successfully",
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

// ==================== DELETE ====================

const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    // Chỉ OWNER của sân mới được xóa
    if (court.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own courts",
      });
    }

    court.status = "INACTIVE";

    await court.save();

    res.status(200).json({
      success: true,
      message: "Court deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyCourts = async (req, res) => {
  try {
    const courts = await Court.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

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
module.exports = {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt,
  getMyCourts,
};
