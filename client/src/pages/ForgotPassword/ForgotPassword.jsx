import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

import TurnstileCaptcha from "../../components/common/TurnstileCaptcha";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!captchaToken) {
        setError("Vui lòng hoàn thành CAPTCHA.");
        return;
      }
      setLoading(true);
      setMessage("");
      setError("");

      const result = await forgotPassword(email, captchaToken);

      setMessage(
        result.message ||
          "Nếu email thuộc tài khoản hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể gửi yêu cầu lúc này. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
      setCaptchaToken("");
      setCaptchaVersion((version) => version + 1);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Quên mật khẩu?</h1>

        <p>
          Nhập email đã đăng ký. Nếu tài khoản hợp lệ, chúng tôi sẽ gửi liên kết
          để bạn tạo mật khẩu mới.
        </p>

        {message && (
          <div className="auth-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <TurnstileCaptcha
          key={captchaVersion}
          action="register"
          onVerify={setCaptchaToken}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
        </button>

        <p>
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
