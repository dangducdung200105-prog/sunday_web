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
