import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
          error.response?.data?.message || "Không thể tải dữ liệu thống kê"
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

  // Dữ liệu cho Biểu đồ Tròn (Trạng thái đặt sân)
  const bookingPieData = [
    { name: "Chờ xác nhận", value: stats.bookings.pending, color: "#f59e0b" },
    { name: "Đã xác nhận", value: stats.bookings.confirmed, color: "#3b82f6" },
    { name: "Hoàn tất", value: stats.bookings.completed, color: "#10b981" },
    { name: "Đã hủy", value: stats.bookings.cancelled, color: "#ef4444" },
  ];

  // Dữ liệu cho Biểu đồ Cột (Người dùng & Sân)
  const userRoleData = [
    { name: "Khách hàng", count: stats.users.customers },
    { name: "Chủ sân", count: stats.users.owners },
    { name: "Admin", count: stats.users.admins },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Tổng quan</h1>
        <p>Tổng quan hệ thống SUNDAY.</p>
      </div>

      {/* 4 Card thống kê nguyên bản của bạn */}
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

      {/* BỔ SUNG: Khu vực biểu đồ sinh động bên dưới */}
      <div className="admin-charts-container">
        {/* Biểu đồ 1: Tỷ lệ đơn đặt sân */}
        <div className="admin-chart-card">
          <h3>Phân bổ trạng thái Đơn đặt sân</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bookingPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} đơn`, "Số lượng"]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Cơ cấu người dùng */}
        <div className="admin-chart-card">
          <h3>Thống kê nhóm người dùng</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} tài khoản`, "Số lượng"]} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
