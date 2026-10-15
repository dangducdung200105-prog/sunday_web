const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const createVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    expires: new Date(Date.now() + 15 * 60 * 1000),
  };
};

const createPasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    expires: new Date(Date.now() + 15 * 60 * 1000),
  };
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified === true,
      },
    },
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verification = createVerificationToken();

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      isEmailVerified: false,
      emailVerificationTokenHash: verification.tokenHash,
      emailVerificationExpires: verification.expires,
    });

    let emailSent = true;

    try {
      await sendVerificationEmail(user.email, verification.token);
    } catch (emailError) {
      emailSent = false;

      // Chỉ ghi lỗi ở server, không trả chi tiết SMTP cho client.
      console.error("Verification email failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? "Account created. Please check your email to verify your account."
        : "Account created, but the verification email could not be sent. Please request another email.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: false,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register at this time",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or expired",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationTokenHash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or expired",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify email at this time",
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const genericResponse = {
      success: true,
      message:
        "If this account exists and needs verification, a new email will be sent.",
    };

    if (!email) {
      return res.status(200).json(genericResponse);
    }

    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified === true) {
      return res.status(200).json(genericResponse);
    }

    const verification = createVerificationToken();

    user.emailVerificationTokenHash = verification.tokenHash;
    user.emailVerificationExpires = verification.expires;

    await user.save();

    try {
      await sendVerificationEmail(user.email, verification.token);
    } catch (emailError) {
      console.error("Resend verification email failed:", emailError);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process the request at this time",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isEmailVerified !== true) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: true,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in at this time",
    });
  }
};

const forgotPassword = async (req, res) => {
  const genericMessage =
    "Nếu email thuộc tài khoản hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.";

  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const user = await User.findOne({ email });

    // Không tiết lộ email có tồn tại hay không.
    if (!user || !user.isActive || user.isEmailVerified !== true) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const reset = createPasswordResetToken();

    user.passwordResetTokenHash = reset.tokenHash;
    user.passwordResetExpires = reset.expires;

    await user.save();

    try {
      await sendPasswordResetEmail(user.email, reset.token);
    } catch (emailError) {
      // Xóa token nếu email không gửi được.
      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      await user.save();

      console.error("Password reset email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash");

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể đặt lại mật khẩu lúc này.",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
