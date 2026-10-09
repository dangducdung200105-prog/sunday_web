const PlayerProfile = require("../models/PlayerProfile");
const Swipe = require("../models/Swipe");
const Match = require("../models/Match");
const mongoose = require("mongoose");

// GET /api/match/players
const getPlayers = async (req, res) => {
  try {
    const { sport, district, skillLevel } = req.query;

    const currentUserId = req.user._id;

    // Những người mà user hiện tại đã swipe
    const swipedUsers = await Swipe.find({
      fromUser: currentUserId,
    }).select("toUser");

    const excludedIds = swipedUsers.map((swipe) => swipe.toUser);

    excludedIds.push(currentUserId);

    const filter = {
      user: {
        $nin: excludedIds,
      },

      isLookingForPlayers: true,
    };

    if (sport) {
      filter["sports.sportType"] = sport.toUpperCase();
    }

    if (district) {
      filter["location.district"] = district;
    }

    if (skillLevel) {
      filter["sports.skillLevel"] = skillLevel.toUpperCase();
    }

    const profiles = await PlayerProfile.find(filter)
      .populate("user", "name avatar phone")
      .limit(30);

    res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("GET PLAYERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// POST /api/match/swipe
const swipePlayer = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const { targetUserId, action } = req.body;

    if (!targetUserId || !action) {
      return res.status(400).json({
        success: false,
        message: "targetUserId and action are required",
      });
    }

    if (!["LIKE", "PASS"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target user ID",
      });
    }

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot swipe yourself",
      });
    }

    const targetProfile = await PlayerProfile.findOne({
      user: targetUserId,
      isLookingForPlayers: true,
    });

    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Kiểm tra swipe cũ
    const existingSwipe = await Swipe.findOne({
      fromUser: currentUserId,
      toUser: targetUserId,
    });

    if (existingSwipe) {
      return res.status(400).json({
        success: false,
        message: "You already swiped this player",
      });
    }

    // Tạo swipe
    await Swipe.create({
      fromUser: currentUserId,
      toUser: targetUserId,
      action,
    });

    // Nếu PASS thì kết thúc
    if (action === "PASS") {
      return res.json({
        success: true,
        matched: false,
        message: "Player passed",
      });
    }

    // Kiểm tra target đã LIKE mình chưa
    const reverseSwipe = await Swipe.findOne({
      fromUser: targetUserId,
      toUser: currentUserId,
      action: "LIKE",
    });

    // Chưa match
    if (!reverseSwipe) {
      return res.json({
        success: true,
        matched: false,
        message: "Player liked successfully",
      });
    }

    // Kiểm tra match đã tồn tại
    const existingMatch = await Match.findOne({
      users: {
        $all: [currentUserId, targetUserId],
      },

      status: "ACTIVE",
    });

    if (existingMatch) {
      return res.json({
        success: true,
        matched: true,
        data: existingMatch,
        message: "Already matched",
      });
    }

    // Tạo match
    const match = await Match.create({
      users: [currentUserId, targetUserId],
      status: "ACTIVE",
    });

    const populatedMatch = await Match.findById(match._id).populate(
      "users",
      "name avatar",
    );

    res.json({
      success: true,
      matched: true,
      message: "It's a match!",
      data: populatedMatch,
    });
  } catch (error) {
    console.error("SWIPE PLAYER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/match
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
      status: "ACTIVE",
    })
      .populate("users", "name avatar")
      .sort({
        matchedAt: -1,
      });

    res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    console.error("GET MATCHES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE /api/match/:matchId
const unmatch = async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.matchId,
      users: req.user._id,
      status: "ACTIVE",
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    match.status = "UNMATCHED";

    await match.save();

    res.json({
      success: true,
      message: "Unmatched successfully",
    });
  } catch (error) {
    console.error("UNMATCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getPlayers,
  swipePlayer,
  getMyMatches,
  unmatch,
};
