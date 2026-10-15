require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    name: "Nguyễn Minh Anh",
    email: "user1@sunday.vn",
    password: "123456",
    phone: "0901000001",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Trần Đức Minh",
    email: "user2@sunday.vn",
    password: "123456",
    phone: "0901000002",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Lê Hoàng Nam",
    email: "user3@sunday.vn",
    password: "123456",
    phone: "0901000003",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Phạm Ngọc Lan",
    email: "user4@sunday.vn",
    password: "123456",
    phone: "0901000004",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Đỗ Quang Huy",
    email: "user5@sunday.vn",
    password: "123456",
    phone: "0901000005",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Nguyễn Thu Trang",
    email: "user6@sunday.vn",
    password: "123456",
    phone: "0901000006",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Vũ Gia Bảo",
    email: "user7@sunday.vn",
    password: "123456",
    phone: "0901000007",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Hoàng Đức Anh",
    email: "user8@sunday.vn",
    password: "123456",
    phone: "0901000008",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Nguyễn Hải Đăng",
    email: "user9@sunday.vn",
    password: "123456",
    phone: "0901000009",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Trần Khánh Linh",
    email: "user10@sunday.vn",
    password: "123456",
    phone: "0901000010",
    role: "USER",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    for (const userData of users) {
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        role: userData.role,
        avatar: userData.avatar,
        isActive: true,
      });

      console.log(`User created: ${user.email}`);
    }

    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
