import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import TurnstileCaptcha from "../../components/common/TurnstileCaptcha";
import "./Login.css";

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setLoading(true);
      setError("");
      if (!captchaToken) {
        setError("Vui lòng hoàn thành CAPTCHA.");
        return;
      }
      const result = await loginUser({ ...formData, captchaToken });

      const { user, token } = result.data;

      login(user, token);

      navigate("/");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
      setCaptchaToken("");
      setCaptchaVersion((version) => version + 1);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>

        <p>Đăng nhập để tiếp tục đặt sân.</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TurnstileCaptcha
          key={captchaVersion}
          action="login"
          onVerify={setCaptchaToken}
        />

        <div className="forgot-password-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default Login;
