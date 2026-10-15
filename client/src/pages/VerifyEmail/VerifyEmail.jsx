import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  verifyEmail,
  resendVerificationEmail,
} from "../../services/authService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");

  const handleVerify = async () => {
    if (!token) {
      setError("Liên kết xác minh không hợp lệ hoặc thiếu token.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await verifyEmail(token);

      setVerified(true);
      setMessage(result.message || "Email đã được xác minh thành công.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể xác minh email. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Vui lòng nhập email đã đăng ký.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setMessage("");

      const result = await resendVerificationEmail(email.trim());

      setMessage(
        result.message ||
          "Nếu tài khoản cần xác minh, email hướng dẫn sẽ được gửi.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Chưa thể gửi yêu cầu. Vui lòng thử lại sau.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Xác minh email</h1>

        {verified ? (
          <>
            <p className="auth-success">{message}</p>
            <p>Email của bạn đã được xác minh.</p>

            <Link to="/login">Đến trang đăng nhập</Link>
          </>
        ) : (
          <>
            <p>Xác minh email để hoàn tất đăng ký tài khoản SUNDAY.</p>

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

            {token ? (
              <button type="button" onClick={handleVerify} disabled={loading}>
                {loading ? "Đang xác minh..." : "Xác minh email"}
              </button>
            ) : (
              <p>
                Không tìm thấy token trong liên kết. Bạn có thể yêu cầu gửi lại
                email bên dưới.
              </p>
            )}

            <hr />

            <h2>Chưa nhận được email?</h2>

            <form onSubmit={handleResend}>
              <input
                type="email"
                placeholder="Email đã đăng ký"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <button type="submit" disabled={resending}>
                {resending ? "Đang gửi..." : "Gửi lại email xác minh"}
              </button>
            </form>

            <p>
              <Link to="/login">Quay lại đăng nhập</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
