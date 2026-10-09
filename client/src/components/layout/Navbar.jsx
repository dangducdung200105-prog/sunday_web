import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          SUNDAY<span>.</span>
        </Link>

        <nav className={`navbar-nav ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/" end className={navClass} onClick={closeMenu}>
            <span>Home</span>
          </NavLink>

          <NavLink to="/courts" className={navClass} onClick={closeMenu}>
            <span>Find Courts</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-bookings" className={navClass} onClick={closeMenu}>
              <span>My Bookings</span>
            </NavLink>
          )}

          <NavLink to="/match" className={navClass} onClick={closeMenu}>
            <span>Tìm bạn chơi</span>
          </NavLink>

          <NavLink to="/matches" className={navClass} onClick={closeMenu}>
            <span>Bạn chơi của tôi</span>
          </NavLink>

          {user?.role === "OWNER" && (
            <NavLink to="/owner" className={navClass} onClick={closeMenu}>
              <span>Owner</span>
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="navbar-profile">
                <div className="navbar-avatar">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="navbar-user-info">
                  <span className="navbar-user-label">Welcome back</span>
                  <span className="navbar-user">{user?.name || "User"}</span>
                </div>
              </div>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Get Started
                <span>→</span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`navbar-menu-button ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
