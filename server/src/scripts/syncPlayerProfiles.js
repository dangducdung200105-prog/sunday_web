const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const User = require("../models/User");
const PlayerProfile = require("../models/PlayerProfile");

const SPORTS = ["FOOTBALL", "BADMINTON", "TENNIS", "BASKETBALL", "VOLLEYBALL"];
const SKILLS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const DISTRICTS = [
  "Cầu Giấy",
  "Đống Đa",
  "Thanh Xuân",
  "Ba Đình",
  "Nam Từ Liêm",
  "Hai Bà Trưng",
  "Tây Hồ",
  "Hà Đông",
  "Bắc Từ Liêm",
];
const TIMES = [
  ["18:00 - 20:00", "Tối thứ 3, 5, 7"],
  ["19:00 - 21:00", "Cuối tuần"],
  ["17:30 - 19:30", "Các ngày trong tuần"],
  ["20:00 - 22:00", "Tối thứ 2, 4, 6"],
  ["06:30 - 08:00", "Sáng cuối tuần"],
];
const BIOS = [
  "Đam mê thể thao, tìm bạn giao lưu và rèn luyện sức khỏe cuối tuần.",
  "Thường chơi sau giờ làm việc, muốn tìm đồng đội cùng trình độ tại Hà Nội.",
  "Yêu thích thể thao năng động, tìm bạn ghép đội chơi thường xuyên.",
  "Tìm bạn chơi vui vẻ, nghiêm túc và đúng giờ.",
  "Mong muốn kết nối thêm những người bạn mới có cùng sở thích thể thao.",
];

async function syncAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({}).lean();
    console.log(`Found ${users.length} total users in DB.`);

    const existingProfiles = await PlayerProfile.find({}).select("user").lean();
    const existingUserIds = new Set(
      existingProfiles.map((p) => p.user?.toString()).filter(Boolean)
    );

    console.log(`Already has ${existingUserIds.size} profiles.`);

    const toCreate = [];
    users.forEach((user, index) => {
      const userIdStr = user._id.toString();
      if (!existingUserIds.has(userIdStr)) {
        const sport1 = SPORTS[index % SPORTS.length];
        const sport2 = SPORTS[(index + 2) % SPORTS.length];
        const skill = SKILLS[index % SKILLS.length];
        const district = DISTRICTS[index % DISTRICTS.length];
        const time = TIMES[index % TIMES.length];
        const bio = BIOS[index % BIOS.length];

        toCreate.push({
          user: user._id,
          displayName: user.name || "Người chơi SUNDAY",
          gender: index % 3 === 0 ? "FEMALE" : "MALE",
          ranking: index % 4 === 0 ? "Bán chuyên" : "Phong trào",
          bio,
          sports: [
            { sportType: sport1, skillLevel: skill },
            { sportType: sport2, skillLevel: "INTERMEDIATE" },
          ],
          location: {
            district,
            city: "Hà Nội",
          },
          preferredTimes: time,
          isLookingForPlayers: true,
        });
      }
    });

    if (toCreate.length > 0) {
      console.log(`Creating ${toCreate.length} missing player profiles...`);
      await PlayerProfile.insertMany(toCreate);
      console.log("Done inserting missing player profiles!");
    } else {
      console.log("All users already have player profiles.");
    }

    const finalCount = await PlayerProfile.countDocuments({ isLookingForPlayers: true });
    console.log(`Total active player profiles available: ${finalCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Sync error:", err);
    process.exit(1);
  }
}

syncAllUsers();
