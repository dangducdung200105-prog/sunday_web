import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="navbar-logo">SUNDAY</div>

          <p>Nền tảng đặt sân thể thao nhanh chóng và tiện lợi.</p>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Khám phá</p>

          <Link to="/">Trang chủ</Link>
          <Link to="/courts">Tìm sân</Link>
          <Link to="/register">Đăng ký chủ sân</Link>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Tài khoản</p>

          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Tạo tài khoản</Link>
          <Link to="/my-bookings">Lịch đặt sân</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SUNDAY. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;