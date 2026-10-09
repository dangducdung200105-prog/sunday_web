const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured");
  }

  const verificationUrl = `${clientUrl}/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Xác minh email tài khoản SUNDAY",
    text: [
      "Xin chào!",
      "",
      "Cảm ơn bạn đã đăng ký SUNDAY.",
      "Nhấn vào liên kết sau để xác minh email:",
      verificationUrl,
      "",
      "Liên kết chỉ có hiệu lực trong 15 phút.",
      "Nếu bạn không đăng ký SUNDAY, hãy bỏ qua email này.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Chào mừng bạn đến với SUNDAY!</h2>
        <p>Vui lòng xác minh email để hoàn tất đăng ký tài khoản.</p>
        <p>
          <a href="${verificationUrl}"
             style="display:inline-block;padding:12px 20px;
                    background:#16834a;color:white;
                    text-decoration:none;border-radius:6px">
            Xác minh email
          </a>
        </p>
        <p>Liên kết có hiệu lực trong 15 phút.</p>
        <p>Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured");
  }

  const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Đặt lại mật khẩu SUNDAY",
    text: [
      "Bạn vừa yêu cầu đặt lại mật khẩu SUNDAY.",
      "",
      "Mở liên kết sau để tạo mật khẩu mới:",
      resetUrl,
      "",
      "Liên kết có hiệu lực trong 15 phút.",
      "Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Đặt lại mật khẩu SUNDAY</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu tài khoản.</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;
                    background:#16834a;color:white;
                    text-decoration:none;border-radius:6px">
            Đặt lại mật khẩu
          </a>
        </p>
        <p>Liên kết có hiệu lực trong 15 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
      </div>
    `,
  });
};
module.exports = { sendVerificationEmail, sendPasswordResetEmail };
