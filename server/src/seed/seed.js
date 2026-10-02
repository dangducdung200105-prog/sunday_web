const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const fs = require("fs");
const { EJSON } = require("bson");
const User = require("../models/User");
const Court = require("../models/Court");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const seedData = EJSON.parse(fs.readFileSync("./sunday_seed.json", "utf-8"));
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected!");

    // Xóa data cũ
    await Payment.deleteMany({});
    await Booking.deleteMany({});
    await Court.deleteMany({});
    await User.deleteMany({});

    console.log("Old data deleted!");

    // Insert data mới
    await User.insertMany(seedData.users);
    await Court.insertMany(seedData.courts);
    await Booking.insertMany(seedData.bookings);
    await Payment.insertMany(seedData.payments);

    console.log("SUNDAY seed completed!");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
