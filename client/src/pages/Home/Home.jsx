import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const sports = [
  { name: "Football", icon: "⚽", type: "FOOTBALL" },
  { name: "Badminton", icon: "🏸", type: "BADMINTON" },
  { name: "Tennis", icon: "🎾", type: "TENNIS" },
  { name: "Basketball", icon: "🏀", type: "BASKETBALL" },
];

const STATS = [
  { value: "< 60s", label: "Thời gian đặt sân trung bình" },
  { value: "Real-time", label: "Cập nhật lịch trống tức thì" },
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
  "Thêm / sửa / xoá sân và upload ảnh",
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
              YOUR GAME STARTS HERE
            </span>

            <h1>
              Find your court.
              <br />
              <span>Play your game.</span>
            </h1>

            <p>
              Discover and book sports courts around you. Simple booking,
              flexible time, better games.
            </p>

            <div className="hero-actions">
              <Link to="/courts" className="home-btn home-btn-primary">
                Find a Court <span>→</span>
              </Link>

              <a href="#how-it-works" className="home-btn home-btn-secondary">
                How it works
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100+</strong>
                <span>Courts</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>Sports</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Booking</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-image">
                <div className="hero-card-overlay" />
                <div className="hero-card-content">
                  <span className="hero-card-badge">Available today</span>
                  <h3>Premium Sports Arena</h3>
                  <p>Hanoi · Badminton</p>

                  <div className="hero-card-bottom">
                    <strong>
                      150,000₫ <small>/ hour</small>
                    </strong>
                    <span className="hero-rating">★ 4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Easy booking</strong>
                <small>Book in seconds</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <strong>4.9</strong>
              <span>★</span>
              <small>Player rating</small>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS */}
      <section className="home-section sports-section">
        <div className="home-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">EXPLORE</span>
              <h2 className="section-title">Choose your sport</h2>
              <p className="section-description">
                Find a court for your favorite game.
              </p>
            </div>

            <Link to="/courts" className="section-link">
              View all →
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
              <span className="eyebrow">SUNDAY PICKS</span>
              <h2 className="section-title">Courts worth playing</h2>
              <p className="section-description">
                Popular courts selected for SUNDAY players.
              </p>
            </div>

            <Link to="/courts" className="section-link">
              Explore courts →
            </Link>
          </div>

          <div className="featured-card">
            <div className="featured-card-icon">🏟️</div>
            <div>
              <h3>Discover your next game</h3>
              <p>Browse available courts and find the perfect place to play.</p>
            </div>
            <Link to="/courts" className="home-btn home-btn-dark">
              Browse Courts
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section how-section" id="how-it-works">
        <div className="home-container">
          <div className="section-heading">
            <span className="eyebrow">SIMPLE BY DESIGN</span>
            <h2 className="section-title">Book. Play. Repeat.</h2>
            <p className="section-description">
              Everything you need to get on the court.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>
              <div className="step-icon">🔍</div>
              <h3>Find a court</h3>
              <p>Search courts by sport, location and availability.</p>
            </div>

            <div className="step">
              <span className="step-number">02</span>
              <div className="step-icon">📅</div>
              <h3>Pick your slot</h3>
              <p>Choose a date and time that works for you.</p>
            </div>

            <div className="step">
              <span className="step-number">03</span>
              <div className="step-icon">🏆</div>
              <h3>Play your game</h3>
              <p>Confirm your booking and enjoy the game.</p>
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
            <span className="eyebrow">FOR PLAYERS</span>
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
            <span className="eyebrow owner-eyebrow">FOR COURT OWNERS</span>
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
            <p className="owner-panel-label">DASHBOARD CHỦ SÂN</p>
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
              <span className="eyebrow cta-eyebrow">READY TO PLAY?</span>
              <h2>Your next game is waiting.</h2>
              <p>Find a court and get on the field today.</p>
            </div>

            <Link to="/courts" className="home-btn home-btn-white">
              Find a Court →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
