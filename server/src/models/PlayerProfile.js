const mongoose = require("mongoose");

const playerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    displayName: { type: String, trim: true, maxlength: 80, default: "" },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      default: "PREFER_NOT_TO_SAY",
    },

    ranking: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "",
    },

    interests: [{ type: String, trim: true, maxlength: 40 }],

    sports: [
      {
        sportType: {
          type: String,
          enum: [
            "FOOTBALL",
            "BADMINTON",
            "TENNIS",
            "BASKETBALL",
            "VOLLEYBALL",
            "OTHER",
          ],
          required: true,
        },

        skillLevel: {
          type: String,
          enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
          default: "BEGINNER",
        },
      },
    ],

    location: {
      district: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "Ha Noi",
        trim: true,
      },
    },

    preferredTimes: [
      {
        type: String,
        trim: true,
      },
    ],

    isLookingForPlayers: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PlayerProfile", playerProfileSchema);
