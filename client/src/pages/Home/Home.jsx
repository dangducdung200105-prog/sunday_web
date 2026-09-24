import { Link } from "react-router-dom";

const STATS = [
  { value: "< 60s", label: "Thời gian đặt sân trung bình" },
  { value: "Real-time", label: "Cập nhật lịch trống tức thì" },
  { value: "4+", label: "Loại sân: bóng đá, cầu lông, tennis, pickleball" },
];

const PLAYER_FEATURES = [
  {
    icon: "📍",
    title: "Tìm sân theo khu vực",
    desc: "Lọc sân theo khu vực và loại hình thể thao chỉ trong vài giây.",
  },
  {
    icon: "🕒",
    title: "Lịch trống real-time",
    desc: "Xem chính xác khung giờ còn trống, không lo trùng lịch.",
  },
  {
    icon: "⚡",
    title: "Đặt sân nhanh chóng",
    desc: "Chọn ngày, khung giờ và giữ chỗ chỉ với vài bước đơn giản.",
  },
  {
    icon: "📅",
    title: "Quản lý lịch đặt",
    desc: "Theo dõi lịch sử đặt sân và huỷ đơn theo đúng chính sách.",
  },
];

const OWNER_FEATURES = [
  "Dashboard quản lý toàn diện cho chủ sân",
  "Thêm / sửa / xoá sân và upload ảnh không giới hạn",
  "Thiết lập giá và khung giờ linh hoạt theo nhu cầu",
  "Xác nhận, huỷ đơn và theo dõi doanh thu theo thời gian thực",
];

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">PLAY. BOOK. ENJOY.</div>

          <h1>
            Đặt sân thể thao 
            <br />
            <span>chuyên nghiệp</span>
          </h1>

          <p>
            Tìm sân thể thao phù hợp, chọn khung giờ và đặt sân chỉ trong vài
            bước.
          </p>

          <div className="hero-actions">
            <Link to="/courts" className="primary-button">
              Tìm sân ngay
            </Link>

            <Link to="/register" className="secondary-button">
              Tạo tài khoản
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="hero-orbit" />

          <div className="hero-ball">🏸</div>

          <div className="hero-float-card card-1">
            <span className="icon">✓</span>
            Đặt sân thành công
          </div>

          <div className="hero-float-card card-2">
            <span className="icon">🕒</span>
            19:00 - 20:00 hôm nay
          </div>

          <div className="hero-float-card card-3">
            <span className="icon">⭐</span>
            4.9 đánh giá
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="page-container stats-grid">
          {STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="page-container">
          <div className="section-heading">
            <span>Dành cho người chơi</span>
            <h2>Trải nghiệm đặt sân thông minh</h2>
          </div>

          <div className="feature-grid">
            {PLAYER_FEATURES.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section owner-section">
        <div className="page-container owner-inner">
          <div className="owner-copy">
            <div className="section-heading">
              <span>Dành cho chủ sân</span>
              <h2>Tối ưu vận hành và doanh thu</h2>
            </div>

            <ul className="owner-list">
              {OWNER_FEATURES.map((item) => (
                <li key={item}>
                  <span className="owner-list-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/register" className="primary-button dark">
              Đăng ký chủ sân
            </Link>
          </div>

          <div className="owner-panel">
            <p className="owner-panel-label">Dashboard chủ sân</p>

            <div className="owner-panel-row">
              <span>Đơn chờ xác nhận</span>
              <strong>—</strong>
            </div>

            <div className="owner-panel-row">
              <span>Sân đang hoạt động</span>
              <strong>—</strong>
            </div>

            <div className="owner-panel-row">
              <span>Doanh thu tháng này</span>
              <strong>—</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="page-container cta-inner">
          <h2>Sẵn sàng đặt sân ngay hôm nay?</h2>

          <p>Không cần cài đặt gì thêm, đăng ký chỉ mất chưa đầy 1 phút.</p>

          <div className="hero-actions">
            <Link to="/courts" className="primary-button">
              Tìm sân ngay
            </Link>

            <Link to="/register" className="secondary-button">
              Dùng thử ngay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;