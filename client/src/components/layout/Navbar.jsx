import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        SUNDAY
      </Link>

      <nav className="navbar-links">
        <Link to="/">Trang chủ</Link>

        <Link to="/courts">Tìm sân</Link>

        {isAuthenticated && <Link to="/my-bookings">Lịch đặt sân</Link>}

        {isAuthenticated && user.role === "ADMIN" && (
          <Link to="/admin">Quản trị</Link>
        )}
      </nav>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span>Xin chào, {user.name}</span>

            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>

            <Link to="/register" className="navbar-register">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
