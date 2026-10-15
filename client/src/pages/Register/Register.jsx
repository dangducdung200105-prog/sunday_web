import { useState } from "react";

import { registerUser } from "../../services/authService";

import TurnstileCaptcha from "../../components/common/TurnstileCaptcha";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!captchaToken) {
        setError("Vui lòng hoàn thành CAPTCHA.");
        return;
      }
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await registerUser({ ...formData, captchaToken });

      setSuccess(
        result.emailSent
          ? "Đăng ký thành công! Hãy kiểm tra email và bấm liên kết xác minh để kích hoạt tài khoản."
          : "Tài khoản đã được tạo nhưng email chưa gửi được. Hãy thử gửi lại email xác minh.",
      );

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
      setCaptchaToken("");
      setCaptchaVersion((version) => version + 1);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Tạo tài khoản</h1>

        <p>Tham gia SUNDAY để bắt đầu đặt sân.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success" role="status">
            {success}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required
        />
        <TurnstileCaptcha
          key={captchaVersion}
          action="register"
          onVerify={setCaptchaToken}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
