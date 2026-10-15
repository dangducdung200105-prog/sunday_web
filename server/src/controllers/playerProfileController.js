const PlayerProfile = require("../models/PlayerProfile");

// GET /api/player-profiles/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await PlayerProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone avatar role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("GET PLAYER PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// POST /api/player-profiles
const createProfile = async (req, res) => {
  try {
    const existingProfile = await PlayerProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Player profile already exists",
      });
    }

    const { bio, sports, location, preferredTimes, isLookingForPlayers } =
      req.body;

    const profile = await PlayerProfile.create({
      user: req.user._id,
      bio,
      sports,
      location,
      preferredTimes,
      isLookingForPlayers,
    });

    const populatedProfile = await PlayerProfile.findById(profile._id).populate(
      "user",
      "name email phone avatar role",
    );

    res.status(201).json({
      success: true,
      message: "Player profile created successfully",
      data: populatedProfile,
    });
  } catch (error) {
    console.error("CREATE PLAYER PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PUT /api/player-profiles/me
const updateMyProfile = async (req, res) => {
  try {
    const { bio, sports, location, preferredTimes, isLookingForPlayers } =
      req.body;

    const profile = await PlayerProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        bio,
        sports,
        location,
        preferredTimes,
        isLookingForPlayers,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("user", "name email phone avatar role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found",
      });
    }

    res.json({
      success: true,
      message: "Player profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("UPDATE PLAYER PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
};
