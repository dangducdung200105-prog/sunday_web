require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const User = require("./models/User");
const PlayerProfile = require("./models/PlayerProfile");

const MONGODB_URI = process.env.MONGODB_URI;

const profiles = [
  {
    email: "user1@sunday.vn",
    bio: "Mình chơi cầu lông được một thời gian, muốn tìm người đánh cùng cuối tuần.",
    sports: [
      {
        sportType: "BADMINTON",
        skillLevel: "INTERMEDIATE",
      },
    ],
    district: "Cầu Giấy",
    preferredTimes: ["Tối thứ 3", "Tối thứ 5", "Cuối tuần"],
  },
  {
    email: "user2@sunday.vn",
    bio: "Thường đá bóng 5 người, ưu tiên các trận giao lưu vui vẻ.",
    sports: [
      {
        sportType: "FOOTBALL",
        skillLevel: "INTERMEDIATE",
      },
    ],
    district: "Nam Từ Liêm",
    preferredTimes: ["Tối thứ 2", "Tối thứ 6"],
  },
  {
    email: "user3@sunday.vn",
    bio: "Mới tập tennis, muốn tìm bạn cùng trình độ để luyện tập.",
    sports: [
      {
        sportType: "TENNIS",
        skillLevel: "BEGINNER",
      },
    ],
    district: "Thanh Xuân",
    preferredTimes: ["Chiều thứ 7", "Sáng chủ nhật"],
  },
  {
    email: "user4@sunday.vn",
    bio: "Mình thích đánh cầu lông và thường chơi sau giờ học.",
    sports: [
      {
        sportType: "BADMINTON",
        skillLevel: "BEGINNER",
      },
    ],
    district: "Đống Đa",
    preferredTimes: ["Tối thứ 2", "Tối thứ 4"],
  },
  {
    email: "user5@sunday.vn",
    bio: "Đá bóng phong trào, có thể tham gia team 5 hoặc 7 người.",
    sports: [
      {
        sportType: "FOOTBALL",
        skillLevel: "ADVANCED",
      },
    ],
    district: "Cầu Giấy",
    preferredTimes: ["Tối thứ 4", "Cuối tuần"],
  },
  {
    email: "user6@sunday.vn",
    bio: "Muốn tìm người chơi tennis thường xuyên hơn.",
    sports: [
      {
        sportType: "TENNIS",
        skillLevel: "INTERMEDIATE",
      },
    ],
    district: "Hai Bà Trưng",
    preferredTimes: ["Tối thứ 3", "Tối thứ 6"],
  },
  {
    email: "user7@sunday.vn",
    bio: "Thích bóng rổ và muốn tìm thêm người chơi cùng.",
    sports: [
      {
        sportType: "BASKETBALL",
        skillLevel: "INTERMEDIATE",
      },
    ],
    district: "Ba Đình",
    preferredTimes: ["Chiều thứ 7", "Chủ nhật"],
  },
  {
    email: "user8@sunday.vn",
    bio: "Chơi cầu lông giải trí, ưu tiên tìm bạn chơi lâu dài.",
    sports: [
      {
        sportType: "BADMINTON",
        skillLevel: "ADVANCED",
      },
    ],
    district: "Cầu Giấy",
    preferredTimes: ["Tối thứ 2", "Tối thứ 5"],
  },
  {
    email: "user9@sunday.vn",
    bio: "Mình đang tìm nhóm đá bóng cuối tuần.",
    sports: [
      {
        sportType: "FOOTBALL",
        skillLevel: "BEGINNER",
      },
    ],
    district: "Hoàng Mai",
    preferredTimes: ["Sáng thứ 7", "Chiều chủ nhật"],
  },
  {
    email: "user10@sunday.vn",
    bio: "Tennis cuối tuần, thích chơi giao lưu và luyện kỹ năng.",
    sports: [
      {
        sportType: "TENNIS",
        skillLevel: "ADVANCED",
      },
    ],
    district: "Tây Hồ",
    preferredTimes: ["Sáng chủ nhật"],
  },
];

async function seedProfiles() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    for (const profile of profiles) {
      const user = await User.findOne({
        email: profile.email,
      });

      if (!user) {
        console.log(`User not found: ${profile.email}`);
        continue;
      }

      await PlayerProfile.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          bio: profile.bio,
          sports: profile.sports,
          location: {
            district: profile.district,
            city: "Ha Noi",
          },
          preferredTimes: profile.preferredTimes,
          isLookingForPlayers: true,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      console.log(`Profile created: ${profile.email}`);
    }

    console.log("Player profiles seeded successfully");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedProfiles();
