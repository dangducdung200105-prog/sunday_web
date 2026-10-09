import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPassword(token, password);

      setSuccess(
        result.message ||
          "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Hãy yêu cầu liên kết mới.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Đặt lại mật khẩu</h1>

        <p>Nhập mật khẩu mới cho tài khoản SUNDAY của bạn.</p>

        {success && (
          <div className="auth-success" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <button type="submit" disabled={loading || !token}>
          {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </button>

        {success && (
          <p>
            <Link to="/login">Đến trang đăng nhập</Link>
          </p>
        )}

        {!token && (
          <p>
            <Link to="/forgot-password">Yêu cầu liên kết mới</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
