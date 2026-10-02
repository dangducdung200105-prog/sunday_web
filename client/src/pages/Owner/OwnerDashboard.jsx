import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getOwnerStatistics } from "../../services/bookingService";

const OwnerDashboard = () => {
  const { user } = useAuth();

  const [statistics, setStatistics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const result = await getOwnerStatistics();

        setStatistics(result.data.statistics);

        setRecentBookings(result.data.recentBookings);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Không thể tải dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard page-container">
      {/* HEADER */}

      <div className="page-header">
        <span>SUNDAY OWNER</span>

        <h1>Xin chào, {user?.name}</h1>

        <p>Quản lý sân và hoạt động kinh doanh của bạn.</p>
      </div>

      {/* STATISTICS */}

      <div className="owner-stats-grid">
        <div className="owner-stat-card">
          <span>Sân của tôi</span>

          <strong>{statistics.totalCourts}</strong>

          <small>sân đang quản lý</small>
        </div>

        <div className="owner-stat-card">
          <span>Tổng booking</span>

          <strong>{statistics.totalBookings}</strong>

          <small>tất cả booking</small>
        </div>

        <div className="owner-stat-card">
          <span>Đang chờ</span>

          <strong>{statistics.pendingBookings}</strong>

          <small>cần xử lý</small>
        </div>

        <div className="owner-stat-card owner-revenue-card">
          <span>Doanh thu</span>

          <strong>{statistics.totalRevenue.toLocaleString("vi-VN")}đ</strong>

          <small>booking đã thanh toán</small>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="owner-section">
        <div className="owner-section-header">
          <div>
            <span>SUNDAY OWNER</span>

            <h2>Quản lý nhanh</h2>
          </div>
        </div>

        <div className="owner-dashboard-grid">
          <Link to="/owner/courts" className="owner-dashboard-card">
            <span className="owner-card-number">01</span>

            <h2>Quản lý sân</h2>

            <p>Xem, thêm và chỉnh sửa các sân thể thao.</p>

            <span className="owner-card-arrow">→</span>
          </Link>

          <Link to="/owner/bookings" className="owner-dashboard-card">
            <span className="owner-card-number">02</span>

            <h2>Booking</h2>

            <p>Theo dõi và xử lý booking của khách hàng.</p>

            <span className="owner-card-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* RECENT BOOKINGS */}

      <div className="owner-section">
        <div className="owner-section-header">
          <div>
            <span>SUNDAY OWNER</span>

            <h2>Booking gần đây</h2>
          </div>

          <Link to="/owner/bookings" className="owner-section-link">
            Xem tất cả →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="owner-empty">
            <h2>Chưa có booking</h2>

            <p>Booking của khách hàng sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          <div className="owner-recent-list">
            {recentBookings.map((booking) => (
              <div className="owner-recent-card" key={booking._id}>
                <div>
                  <span>{booking.court?.sportType}</span>

                  <h3>{booking.court?.name}</h3>

                  <p>Khách: {booking.user?.name}</p>
                </div>

                <div>
                  <span>Ngày</span>

                  <strong>{booking.bookingDate}</strong>
                </div>

                <div>
                  <span>Giờ</span>

                  <strong>
                    {booking.startTime}
                    {" - "}
                    {booking.endTime}
                  </strong>
                </div>

                <div>
                  <span>Giá</span>

                  <strong>{booking.price.toLocaleString("vi-VN")}đ</strong>
                </div>

                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
