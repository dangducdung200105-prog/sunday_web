import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="owner-dashboard page-container">
      <div className="page-header">
        <span>SUNDAY OWNER</span>

        <h1>Xin chào, {user?.name}</h1>

        <p>Quản lý sân và hoạt động kinh doanh của bạn.</p>
      </div>

      <div className="owner-dashboard-grid">
        <Link to="/owner/courts" className="owner-dashboard-card">
          <span className="owner-card-number">01</span>

          <h2>Quản lý sân</h2>

          <p>Xem, thêm và chỉnh sửa các sân thể thao của bạn.</p>

          <span className="owner-card-arrow">→</span>
        </Link>

        <Link to="/owner/bookings" className="owner-dashboard-card">
          <span className="owner-card-number">02</span>

          <h2>Booking</h2>

          <p>Theo dõi các lượt đặt sân từ khách hàng.</p>

          <span className="owner-card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
