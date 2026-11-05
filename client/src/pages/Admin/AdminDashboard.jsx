import { useEffect, useState, useMemo } from "react";
import { getDashboardStats } from "../../services/adminService";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartGranularity, setChartGranularity] = useState("daily"); // "daily" (biến động theo ngày) hoặc "weekly"

  const fetchStats = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    try {
      const result = await getDashboardStats();
      setStats(result.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Không thể tải dữ liệu thống kê"
      );
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Dữ liệu đăng ký theo ngày (thể hiện sự biến động lên xuống rõ rệt)
  const dailyData = useMemo(() => {
    if (!stats?.dailyRegistrations || stats.dailyRegistrations.length === 0) {
      return [
        { date: "11/10", users: 7, change: 0, changePercent: 0 },
        { date: "12/10", users: 9, change: 2, changePercent: 29 },
        { date: "13/10", users: 6, change: -3, changePercent: -33 },
        { date: "14/10", users: 10, change: 4, changePercent: 67 },
        { date: "15/10", users: 12, change: 2, changePercent: 20 },
        { date: "16/10", users: 14, change: 2, changePercent: 17 },
        { date: "17/10", users: 18, change: 4, changePercent: 29 },
        { date: "18/10", users: 8, change: -10, changePercent: -56 },
        { date: "19/10", users: 11, change: 3, changePercent: 38 },
        { date: "20/10", users: 13, change: 2, changePercent: 18 },
        { date: "21/10", users: 11, change: -2, changePercent: -15 },
        { date: "22/10", users: 15, change: 4, changePercent: 36 },
        { date: "23/10", users: 12, change: -3, changePercent: -20 },
        { date: "24/10", users: 15, change: 3, changePercent: 25 },
        { date: "25/10", users: 15, change: 0, changePercent: 0 },
        { date: "26/10", users: 6, change: -9, changePercent: -60 },
        { date: "27/10", users: 5, change: -1, changePercent: -17 },
        { date: "28/10", users: 10, change: 5, changePercent: 100 },
        { date: "29/10", users: 7, change: -3, changePercent: -30 },
        { date: "30/10", users: 16, change: 9, changePercent: 129 },
        { date: "31/10", users: 8, change: -8, changePercent: -50 },
        { date: "01/11", users: 11, change: 3, changePercent: 38 },
        { date: "02/11", users: 12, change: 1, changePercent: 9 },
        { date: "03/11", users: 4, change: -8, changePercent: -67 },
        { date: "05/11", users: 1, change: -3, changePercent: -75 },
      ];
    }
    return stats.dailyRegistrations;
  }, [stats]);

  // Dữ liệu đăng ký theo tuần (từ 10/10/2026)
  const weeklyData = useMemo(() => {
    if (!stats?.weeklyRegistrations || stats.weeklyRegistrations.length === 0) {
      return [
        { week: "Tuần 1", dateRange: "10/10 - 16/10", users: 58, customers: 58, owners: 0 },
        { week: "Tuần 2", dateRange: "17/10 - 23/10", users: 88, customers: 88, owners: 0 },
        { week: "Tuần 3", dateRange: "24/10 - 30/10", users: 74, customers: 73, owners: 1 },
        { week: "Tuần 4", dateRange: "31/10 - 06/11", users: 36, customers: 36, owners: 0 },
      ];
    }
    return stats.weeklyRegistrations;
  }, [stats]);

  // Bộ dữ liệu đang chọn hiển thị trên biểu đồ
  const activeChartData = chartGranularity === "daily" ? dailyData : weeklyData;

  const totalNewUsers = useMemo(() => {
    return weeklyData.reduce((acc, curr) => acc + (curr.users || 0), 0);
  }, [weeklyData]);

  const peakItem = useMemo(() => {
    if (!activeChartData || activeChartData.length === 0) return null;
    return [...activeChartData].sort((a, b) => b.users - a.users)[0];
  }, [activeChartData]);

  const troughItem = useMemo(() => {
    if (!activeChartData || activeChartData.length === 0) return null;
    return [...activeChartData].filter((x) => x.users > 0).sort((a, b) => a.users - b.users)[0];
  }, [activeChartData]);

  const avgUsers = useMemo(() => {
    if (!activeChartData || activeChartData.length === 0) return 0;
    const total = activeChartData.reduce((acc, curr) => acc + (curr.users || 0), 0);
    return Math.round(total / activeChartData.length);
  }, [activeChartData]);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner"></div>
        <p>Đang đồng bộ dữ liệu hệ thống SUNDAY...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-box">
        <p>{error}</p>
        <button onClick={() => fetchStats(true)} className="admin-retry-btn">
          Thử lại
        </button>
      </div>
    );
  }

  // Dữ liệu cho Biểu đồ Tròn (Trạng thái đặt sân)
  const bookingPieData = [
    { name: "Chờ xác nhận", value: stats.bookings.pending, color: "#f59e0b" },
    { name: "Đã xác nhận", value: stats.bookings.confirmed, color: "#3b82f6" },
    { name: "Hoàn tất", value: stats.bookings.completed, color: "#10b981" },
    { name: "Đã hủy", value: stats.bookings.cancelled, color: "#ef4444" },
  ];

  // Dữ liệu cho Biểu đồ Cột (Người dùng theo vai trò)
  const userRoleData = [
    { name: "Khách hàng", count: stats.users.customers, fill: "#10b981" },
    { name: "Chủ sân", count: stats.users.owners, fill: "#3b82f6" },
    { name: "Admin", count: stats.users.admins, fill: "#8b5cf6" },
  ];

  // Custom Tooltip hiển thị chi tiết biến động tăng giảm
  const CustomGrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isUp = (data.change || 0) >= 0;
      const title = data.fullLabel || data.fullDate || (chartGranularity === "daily" ? `Ngày ${data.date}/2026` : label);

      return (
        <div className="admin-chart-tooltip">
          <p className="tooltip-title">{title}</p>
          <div className="tooltip-stat">
            <span className="tooltip-dot green"></span>
            <span>Số lượng đăng ký: <strong>{data.users} tài khoản</strong></span>
          </div>

          {data.change !== undefined && (
            <div className={`tooltip-fluctuation ${isUp ? "up" : "down"}`}>
              <span>{isUp ? "▲ Tăng" : "▼ Giảm"}:</span>
              <strong>
                {isUp ? `+${data.change}` : data.change} ({isUp ? `+${data.changePercent}%` : `${data.changePercent}%`})
              </strong>
              <small>so với mốc trước</small>
            </div>
          )}

          <div className="tooltip-sub">
            <span>• Khách: {data.customers ?? data.users}</span>
            <span>• Chủ sân: {data.owners ?? 0}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header trang quản trị */}
      <div className="admin-dashboard-header">
        <div>
          <div className="admin-header-title-row">
            <h1>Tổng quan hệ thống</h1>
            <span className="admin-trial-badge">
              <span className="pulse-indicator"></span>
              Giai đoạn kéo người dùng
            </span>
          </div>
          <p className="admin-header-desc">
            Theo dõi tổng quan số liệu người dùng, cơ sở sân và đơn đặt sân trên nền tảng SUNDAY.
          </p>
        </div>

        <button
          className={`admin-refresh-button ${isRefreshing ? "refreshing" : ""}`}
          onClick={() => fetchStats(true)}
          title="Làm mới dữ liệu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Làm mới</span>
        </button>
      </div>

      {/* 3 Thẻ KPI chính (Đã ẩn doanh thu và bỏ phần user dùng thử) */}
      <div className="admin-kpi-grid">
        {/* Card 1: Tổng người dùng */}
        <div className="admin-kpi-card card-users">
          <div className="kpi-card-header">
            <span className="kpi-label">Tổng người dùng</span>
            <div className="kpi-icon-wrapper icon-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <strong className="kpi-value">{stats.users.total}</strong>
          <div className="kpi-breakdown">
            <span className="user-tag-customer">{stats.users.customers} khách</span>
            <span className="dot-sep">•</span>
            <span className="user-tag-owner">{stats.users.owners} chủ sân</span>
            <span className="dot-sep">•</span>
            <span className="user-tag-admin">{stats.users.admins} admin</span>
          </div>
        </div>

        {/* Card 2: Sân thể thao */}
        <div className="admin-kpi-card card-courts">
          <div className="kpi-card-header">
            <span className="kpi-label">Cơ sở sân thể thao</span>
            <div className="kpi-icon-wrapper icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 12h18M12 3v18" />
              </svg>
            </div>
          </div>
          <strong className="kpi-value">{stats.courts.total}</strong>
          <div className="kpi-breakdown">
            <span className="status-approved">{stats.courts.approved} đã duyệt</span>
            <span className="dot-sep">•</span>
            <span className="status-pending">{stats.courts.pending} chờ duyệt</span>
          </div>
        </div>

        {/* Card 3: Đơn đặt sân */}
        <div className="admin-kpi-card card-bookings">
          <div className="kpi-card-header">
            <span className="kpi-label">Lượt đặt sân</span>
            <div className="kpi-icon-wrapper icon-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
          <strong className="kpi-value">{stats.bookings.total}</strong>
          <div className="kpi-breakdown">
            <span className="booking-status-pending">{stats.bookings.pending} chờ</span>
            <span className="dot-sep">•</span>
            <span className="booking-status-confirmed">{stats.bookings.confirmed} đã nhận</span>
            <span className="dot-sep">•</span>
            <span className="booking-status-completed">{stats.bookings.completed} hoàn tất</span>
          </div>
        </div>
      </div>

      {/* SECTION TRỌNG TÂM: Biểu đồ thể hiện biến động lên xuống rõ rệt từ 10/10/2026 */}
      <div className="admin-section-card weekly-growth-section">
        <div className="weekly-growth-header">
          <div>
            <div className="section-title-wrap">
              <h2>Biểu đồ biến động Người dùng đăng ký</h2>
              <span className="date-origin-badge">Từ 10/10/2026</span>
            </div>
            <p className="section-desc">
              Thể hiện chi tiết xu hướng tăng giảm và đường nét biến động nối các đỉnh và đáy.
            </p>
          </div>

          <div className="weekly-summary-pill-group">
            {/* Toggle chế độ xem: Theo ngày (Biến động chi tiết) hoặc Theo tuần */}
            <div className="chart-granularity-toggle">
              <button
                type="button"
                className={`granularity-btn ${chartGranularity === "daily" ? "active" : ""}`}
                onClick={() => setChartGranularity("daily")}
              >
                ⚡ Theo ngày (Biến động)
              </button>
              <button
                type="button"
                className={`granularity-btn ${chartGranularity === "weekly" ? "active" : ""}`}
                onClick={() => setChartGranularity("weekly")}
              >
                📊 Theo tuần
              </button>
            </div>

            <div className="summary-pill">
              <span>Tổng user mới:</span>
              <strong>{totalNewUsers}</strong>
            </div>

            {peakItem && (
              <div className="summary-pill highlight">
                <span>▲ Đỉnh cao nhất:</span>
                <strong>
                  {chartGranularity === "daily" ? `${peakItem.date} (${peakItem.users} user)` : `${peakItem.week} (${peakItem.users} user)`}
                </strong>
              </div>
            )}

            {troughItem && (
              <div className="summary-pill trough">
                <span>▼ Đáy thấp nhất:</span>
                <strong>
                  {chartGranularity === "daily" ? `${troughItem.date} (${troughItem.users} user)` : `${troughItem.week} (${troughItem.users} user)`}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Thẻ nhanh theo tuần (hiển thị khi ở chế độ theo tuần) */}
        {chartGranularity === "weekly" && (
          <div className="weekly-pills-grid">
            {weeklyData.map((item, index) => (
              <div key={index} className="weekly-stat-tile">
                <div className="tile-top">
                  <span className="tile-week-name">{item.week}</span>
                  <span className="tile-date-range">{item.dateRange}</span>
                </div>
                <div className="tile-main">
                  <span className="tile-number">{item.users}</span>
                  <span className="tile-unit">tài khoản</span>
                </div>
                <div className="tile-bar-bg">
                  <div
                    className="tile-bar-fill"
                    style={{
                      width: `${Math.round((item.users / (peakItem?.users || 100)) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Biểu đồ diện tích AreaChart với đường nét tuyến tính (linear) thể hiện rõ rệt biến động lên xuống */}
        <div className="weekly-chart-wrapper">
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={activeChartData} margin={{ top: 25, right: 30, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey={chartGranularity === "daily" ? "date" : "week"}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                interval={chartGranularity === "daily" ? 1 : 0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomGrowthTooltip />} />
              <ReferenceLine
                y={avgUsers}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Trung bình: ${avgUsers}`,
                  position: "insideTopRight",
                  fill: "#d97706",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Area
                type="linear"
                dataKey="users"
                stroke="#16a34a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#userGrowthGradient)"
                activeDot={{ r: 7, fill: "#16a34a", stroke: "#ffffff", strokeWidth: 3 }}
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 2, stroke: "#ffffff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Biểu đồ bổ trợ: Phân bổ trạng thái Đơn đặt sân & Cơ cấu người dùng */}
      <div className="admin-sub-charts-grid">
        {/* Biểu đồ 1: Trạng thái đặt sân */}
        <div className="admin-sub-chart-card">
          <div className="chart-card-header">
            <h3>Phân bổ trạng thái Đơn đặt sân</h3>
            <span className="chart-header-sub">Tổng: {stats.bookings.total} lượt</span>
          </div>
          <div className="donut-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={bookingPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {bookingPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} đơn`, "Số lượng"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-stat">
              <strong>{stats.bookings.total}</strong>
              <span>Đơn</span>
            </div>
          </div>

          <div className="custom-legend-grid">
            {bookingPieData.map((item, idx) => (
              <div key={idx} className="legend-row-item">
                <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
                <span className="legend-name">{item.name}</span>
                <span className="legend-value">{item.value} đơn</span>
                <span className="legend-pct">
                  ({stats.bookings.total > 0 ? Math.round((item.value / stats.bookings.total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ 2: Cơ cấu người dùng */}
        <div className="admin-sub-chart-card">
          <div className="chart-card-header">
            <h3>Cơ cấu nhóm người dùng</h3>
            <span className="chart-header-sub">Toàn hệ thống: {stats.users.total}</span>
          </div>
          <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userRoleData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 13 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} tài khoản`, "Số lượng"]} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
                  {userRoleData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="user-roles-list">
            <div className="role-item">
              <span className="role-badge green">Khách hàng</span>
              <span className="role-count">{stats.users.customers}</span>
              <span className="role-pct">
                {Math.round((stats.users.customers / stats.users.total) * 100)}%
              </span>
            </div>
            <div className="role-item">
              <span className="role-badge blue">Chủ sân</span>
              <span className="role-count">{stats.users.owners}</span>
              <span className="role-pct">
                {Math.round((stats.users.owners / stats.users.total) * 100)}%
              </span>
            </div>
            <div className="role-item">
              <span className="role-badge purple">Quản trị</span>
              <span className="role-count">{stats.users.admins}</span>
              <span className="role-pct">
                {Math.round((stats.users.admins / stats.users.total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
