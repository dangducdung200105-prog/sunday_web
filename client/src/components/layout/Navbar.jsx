import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SUNDAY
          <span>.</span>
        </Link>

        {/* Navigation */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/courts"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Find Courts
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Bookings
            </NavLink>
          )}

          {user?.role === "OWNER" && (
            <NavLink
              to="/owner"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Owner
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Hi, {user?.name}</span>

              <button
                className="btn btn-secondary navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
