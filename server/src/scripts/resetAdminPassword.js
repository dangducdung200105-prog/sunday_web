const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const newPassword = "123456";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.findOneAndUpdate(
      { email: "admin@sunday.com" },
      {
        $set: {
          password: hashedPassword,
          isEmailVerified: true,
          isActive: true,
        },
      },
      { new: true }
    );

    if (!result) {
      console.log("Không tìm thấy user admin@sunday.com");
    } else {
      console.log("Thành công! Đã cập nhật mật khẩu của admin@sunday.com thành: 123456");
      console.log("Đã cập nhật isEmailVerified: true để đăng nhập không bị chặn.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Lỗi cập nhật mật khẩu:", error);
    process.exit(1);
  }
}

resetAdmin();
