const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

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

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: null,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    slotDurationMinutes: {
      type: Number,
      enum: [30, 60, 90, 120],
      default: 60,
    },
    openingTime: {
      type: String,
      required: true,
    },

    closingTime: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Court = mongoose.model("Court", courtSchema);

module.exports = Court;
