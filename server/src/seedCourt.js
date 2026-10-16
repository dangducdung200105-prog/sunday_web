require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const User = require("./models/User");
const Court = require("./models/Court");

const MONGODB_URI = process.env.MONGODB_URI;

const courts = [
  {
    ownerEmail: "user1@sunday.vn",
    name: "SUNDAY Badminton Center 01",
    description: "Sân cầu lông trong nhà, phù hợp tập luyện và giao lưu.",
    sportType: "BADMINTON",
    address: "Cầu Giấy, Hà Nội",
    location: {
      latitude: 21.0362,
      longitude: 105.7906,
    },
    pricePerHour: 100000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "INDOOR"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user2@sunday.vn",
    name: "SUNDAY Football Arena 01",
    description:
      "Sân bóng đá mini cỏ nhân tạo dành cho các đội bóng phong trào.",
    sportType: "FOOTBALL",
    address: "Nam Từ Liêm, Hà Nội",
    location: {
      latitude: 21.0158,
      longitude: 105.7662,
    },
    pricePerHour: 500000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "23:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "CHANGING_ROOM"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user3@sunday.vn",
    name: "SUNDAY Tennis Court 01",
    description: "Sân tennis dành cho luyện tập cá nhân và đánh đôi.",
    sportType: "TENNIS",
    address: "Thanh Xuân, Hà Nội",
    location: {
      latitude: 20.9958,
      longitude: 105.8145,
    },
    pricePerHour: 250000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "21:00",
    images: [],
    amenities: ["PARKING", "LIGHTING"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user4@sunday.vn",
    name: "SUNDAY Badminton Center 02",
    description:
      "Sân cầu lông phù hợp cho người mới chơi và người chơi thường xuyên.",
    sportType: "BADMINTON",
    address: "Đống Đa, Hà Nội",
    location: {
      latitude: 21.0185,
      longitude: 105.8298,
    },
    pricePerHour: 80000,
    slotDurationMinutes: 60,
    openingTime: "05:30",
    closingTime: "22:00",
    images: [],
    amenities: ["INDOOR", "PARKING", "LIGHTING"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user5@sunday.vn",
    name: "SUNDAY Football Arena 02",
    description: "Sân bóng mini phục vụ các trận đấu giao hữu và thi đấu nhóm.",
    sportType: "FOOTBALL",
    address: "Cầu Giấy, Hà Nội",
    location: {
      latitude: 21.0365,
      longitude: 105.798,
    },
    pricePerHour: 400000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "CHANGING_ROOM"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user6@sunday.vn",
    name: "SUNDAY Tennis Court 02",
    description: "Sân tennis phục vụ các buổi luyện tập và giao lưu cuối tuần.",
    sportType: "TENNIS",
    address: "Hai Bà Trưng, Hà Nội",
    location: {
      latitude: 21.0065,
      longitude: 105.8521,
    },
    pricePerHour: 200000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "21:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "WATER"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user7@sunday.vn",
    name: "SUNDAY Basketball Court 01",
    description:
      "Sân bóng rổ dành cho nhóm bạn luyện tập và thi đấu phong trào.",
    sportType: "BASKETBALL",
    address: "Ba Đình, Hà Nội",
    location: {
      latitude: 21.034,
      longitude: 105.814,
    },
    pricePerHour: 180000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "WATER"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user8@sunday.vn",
    name: "SUNDAY Badminton Center 03",
    description:
      "Sân cầu lông dành cho các buổi tập luyện sau giờ học và làm việc.",
    sportType: "BADMINTON",
    address: "Tây Hồ, Hà Nội",
    location: {
      latitude: 21.0681,
      longitude: 105.8188,
    },
    pricePerHour: 120000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: ["INDOOR", "PARKING", "LIGHTING"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user9@sunday.vn",
    name: "SUNDAY Football Arena 03",
    description: "Sân bóng mini phù hợp cho các nhóm bạn đá bóng cuối tuần.",
    sportType: "FOOTBALL",
    address: "Hoàng Mai, Hà Nội",
    location: {
      latitude: 20.9748,
      longitude: 105.8415,
    },
    pricePerHour: 350000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: ["PARKING", "LIGHTING"],
    status: "ACTIVE",
    isApproved: true,
  },
  {
    ownerEmail: "user10@sunday.vn",
    name: "SUNDAY Tennis Court 03",
    description:
      "Sân tennis dành cho người chơi muốn nâng cao kỹ năng và giao lưu.",
    sportType: "TENNIS",
    address: "Tây Hồ, Hà Nội",
    location: {
      latitude: 21.058,
      longitude: 105.82,
    },
    pricePerHour: 220000,
    slotDurationMinutes: 60,
    openingTime: "06:00",
    closingTime: "21:00",
    images: [],
    amenities: ["PARKING", "LIGHTING", "CHANGING_ROOM"],
    status: "ACTIVE",
    isApproved: true,
  },
];

async function seedCourts() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI chưa được cấu hình trong file .env");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const courtData of courts) {
      const user = await User.findOne({
        email: courtData.ownerEmail,
      });

      if (!user) {
        console.log(`User not found: ${courtData.ownerEmail}`);
        skipped++;
        continue;
      }

      // Dùng tên sân + chủ sân để tránh tạo trùng khi chạy lại.
      const filter = {
        owner: user._id,
        name: courtData.name,
      };

      const existingCourt = await Court.findOne(filter);

      const { ownerEmail, ...courtFields } = courtData;

      await Court.findOneAndUpdate(
        filter,
        {
          $set: {
            ...courtFields,
            owner: user._id,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      if (existingCourt) {
        updated++;
        console.log(`Court updated: ${courtData.name}`);
      } else {
        created++;
        console.log(`Court created: ${courtData.name}`);
      }
    }

    console.log("\n========== SEED SUMMARY ==========");
    console.log(`Total configured: ${courts.length}`);
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log("Court seeding completed!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCourts();
