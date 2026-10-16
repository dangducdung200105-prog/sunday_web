import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const sports = [
  { name: "Bóng đá", icon: "⚽", type: "FOOTBALL" },
  { name: "Cầu lông", icon: "🏸", type: "BADMINTON" },
  { name: "Quần vợt", icon: "🎾", type: "TENNIS" },
  { name: "Bóng rổ", icon: "🏀", type: "BASKETBALL" },
];

const STATS = [
  { value: "< 60s", label: "Thời gian đặt sân trung bình" },
  { value: "Theo thời gian thực", label: "Cập nhật lịch trống tức thì" },
  { value: "4+", label: "Loại hình thể thao" },
];

const PLAYER_FEATURES = [
  {
    icon: "📍",
    title: "Tìm sân theo khu vực",
    desc: "Lọc sân theo khu vực và loại hình thể thao chỉ trong vài giây.",
  },
  {
    icon: "🕒",
    title: "Lịch trống theo thời gian thực",
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
  "Tổng quan quản lý toàn diện cho chủ sân",
  "Thêm / sửa / xóa sân và tải ảnh lên",
  "Thiết lập giá và khung giờ linh hoạt",
  "Xác nhận, huỷ đơn và theo dõi doanh thu",
];

const Home = () => {
  const navigate = useNavigate();

  const handleSportClick = (sport) => {
    navigate(`/courts?sportType=${sport.type}`);
  };

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="home-container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
            BẮT ĐẦU TRẬN ĐẤU CỦA BẠN
            </span>

            <h1>
              Tìm sân phù hợp.
              <br />
              <span>Sẵn sàng ra sân.</span>
            </h1>

            <p>
              Khám phá và đặt sân thể thao quanh bạn. Đặt sân dễ dàng,
              thời gian linh hoạt, cuộc chơi trọn vẹn.
            </p>

            <div className="hero-actions">
              <Link to="/courts" className="home-btn home-btn-primary">
                Tìm sân <span>→</span>
              </Link>

              <a href="#how-it-works" className="home-btn home-btn-secondary">
                Cách thức hoạt động
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100+</strong>
                <span>Sân thể thao</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>Môn thể thao</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Đặt sân</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-image">
                <div className="hero-card-overlay" />
                <div className="hero-card-content">
                  <span className="hero-card-badge">Còn sân hôm nay</span>
                  <h3>Khu liên hợp thể thao</h3>
                  <p>Hà Nội · Cầu lông</p>

                  <div className="hero-card-bottom">
                    <strong>
                      150,000₫ <small>/ giờ</small>
                    </strong>
                    <span className="hero-rating">★ 4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Đặt sân dễ dàng</strong>
                <small>Chỉ trong vài giây</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <strong>4.9</strong>
              <span>★</span>
              <small>Đánh giá người chơi</small>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS */}
      <section className="home-section sports-section">
        <div className="home-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">KHÁM PHÁ</span>
              <h2 className="section-title">Chọn môn thể thao</h2>
              <p className="section-description">
                Tìm sân cho môn thể thao yêu thích của bạn.
              </p>
            </div>

            <Link to="/courts" className="section-link">
              Xem tất cả →
            </Link>
          </div>

          <div className="sports-grid">
            {sports.map((sport) => (
              <button
                key={sport.type}
                type="button"
                className="sport-card"
                onClick={() => handleSportClick(sport)}
              >
                <span className="sport-icon">{sport.icon}</span>
                <span className="sport-name">{sport.name}</span>
                <span className="sport-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="home-section featured-section">
        <div className="home-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">SUNDAY GỢI Ý</span>
              <h2 className="section-title">Những sân đáng trải nghiệm</h2>
              <p className="section-description">
                Các sân được người chơi SUNDAY yêu thích.
              </p>
            </div>

            <Link to="/courts" className="section-link">
              Khám phá sân →
            </Link>
          </div>

          <div className="featured-card">
            <div className="featured-card-icon">🏟️</div>
            <div>
              <h3>Khám phá cuộc chơi tiếp theo</h3>
              <p>Tìm sân còn trống và chọn địa điểm phù hợp để ra sân.</p>
            </div>
            <Link to="/courts" className="home-btn home-btn-dark">
              Xem danh sách sân
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section how-section" id="how-it-works">
        <div className="home-container">
          <div className="section-heading">
            <span className="eyebrow">ĐƠN GIẢN, DỄ SỬ DỤNG</span>
            <h2 className="section-title">Đặt sân. Ra sân. Tận hưởng.</h2>
            <p className="section-description">
              Mọi thứ bạn cần để sẵn sàng cho trận đấu.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>
              <div className="step-icon">🔍</div>
              <h3>Tìm sân</h3>
              <p>Tìm sân theo môn thể thao, khu vực và lịch trống.</p>
            </div>

            <div className="step">
              <span className="step-number">02</span>
              <div className="step-icon">📅</div>
              <h3>Chọn khung giờ</h3>
              <p>Chọn ngày và giờ phù hợp với bạn.</p>
            </div>

            <div className="step">
              <span className="step-number">03</span>
              <div className="step-icon">🏆</div>
              <h3>Tận hưởng trận đấu</h3>
              <p>Xác nhận đặt sân và sẵn sàng ra sân.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip">
        <div className="home-container stats-grid">
          {STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PLAYER FEATURES */}
      <section className="home-section features-section">
        <div className="home-container">
          <div className="section-heading">
            <span className="eyebrow">DÀNH CHO NGƯỜI CHƠI</span>
            <h2 className="section-title">Trải nghiệm đặt sân thông minh</h2>
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

      {/* OWNER */}
      <section className="home-section owner-section">
        <div className="home-container owner-inner">
          <div className="owner-copy">
            <span className="eyebrow owner-eyebrow">DÀNH CHO CHỦ SÂN</span>
            <h2>Quản lý sân dễ dàng hơn.</h2>
            <p>
              Tập trung vào vận hành sân, còn SUNDAY hỗ trợ bạn quản lý lịch đặt
              và khách hàng.
            </p>

            <ul className="owner-list">
              {OWNER_FEATURES.map((item) => (
                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/register" className="home-btn home-btn-green">
              Đăng ký chủ sân
            </Link>
          </div>

          <div className="owner-panel">
            <p className="owner-panel-label">TỔNG QUAN CHỦ SÂN</p>
            <div className="owner-panel-row">
              <span>Đơn chờ xác nhận</span>
              <strong>12</strong>
            </div>
            <div className="owner-panel-row">
              <span>Sân đang hoạt động</span>
              <strong>08</strong>
            </div>
            <div className="owner-panel-row">
              <span>Doanh thu tháng này</span>
              <strong>24.8M</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="home-container">
          <div className="cta-card">
            <div>
              <span className="eyebrow cta-eyebrow">SẴN SÀNG RA SÂN?</span>
              <h2>Trận đấu tiếp theo đang chờ bạn.</h2>
              <p>Tìm sân và bắt đầu cuộc chơi ngay hôm nay.</p>
            </div>

            <Link to="/courts" className="home-btn home-btn-white">
              Tìm sân →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
