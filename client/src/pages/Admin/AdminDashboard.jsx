import { useEffect, useState } from "react";

import { getDashboardStats } from "../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();

        setStats(result.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Không thể tải dữ liệu thống kê",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Đang tải thống kê...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>

        <p>Tổng quan hệ thống SUNDAY.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Người dùng</span>
          <strong>{stats.users.total}</strong>
          <p>
            {stats.users.customers} khách · {stats.users.owners} chủ sân ·{" "}
            {stats.users.admins} admin
          </p>
        </div>

        <div className="admin-stat-card">
          <span>Sân</span>
          <strong>{stats.courts.total}</strong>
          <p>
            {stats.courts.approved} đã duyệt · {stats.courts.pending} chờ
            duyệt
          </p>
        </div>

        <div className="admin-stat-card">
          <span>Đơn đặt sân</span>
          <strong>{stats.bookings.total}</strong>
          <p>
            {stats.bookings.pending} chờ · {stats.bookings.confirmed} xác
            nhận · {stats.bookings.cancelled} hủy ·{" "}
            {stats.bookings.completed} hoàn tất
          </p>
        </div>

        <div className="admin-stat-card">
          <span>Doanh thu (đã thanh toán)</span>
          <strong>{stats.revenue.toLocaleString("vi-VN")}đ</strong>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
