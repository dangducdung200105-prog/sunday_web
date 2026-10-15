const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: ["LIKE", "PASS"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Một user chỉ được swipe một user khác một lần
swipeSchema.index(
  {
    fromUser: 1,
    toUser: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Swipe", swipeSchema);
