import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const sports = [
  {
    name: "Football",
    icon: "⚽",
    type: "FOOTBALL",
  },
  {
    name: "Badminton",
    icon: "🏸",
    type: "BADMINTON",
  },
  {
    name: "Tennis",
    icon: "🎾",
    type: "TENNIS",
  },
  {
    name: "Basketball",
    icon: "🏀",
    type: "BASKETBALL",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleSportClick = (sport) => {
    navigate(`/courts?sportType=${sport.type}`);
  };

  return (
    <main className="home">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot"></span>
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
              <Link to="/courts" className="btn btn-primary hero-button">
                Find a Court
                <span>→</span>
              </Link>

              <a href="#how-it-works" className="btn btn-secondary hero-button">
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
            <div className="hero-card hero-card-main">
              <div className="hero-card-image">
                <div className="hero-image-overlay"></div>

                <div className="hero-card-content">
                  <span className="badge badge-green">Available today</span>

                  <h3>Premium Sports Arena</h3>

                  <p>Hanoi · Badminton</p>

                  <div className="hero-card-bottom">
                    <strong>
                      150,000₫
                      <small>/ hour</small>
                    </strong>

                    <span className="rating">★ 4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span>✓</span>
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

      {/* ================= SPORTS ================= */}
      <section className="section sports-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore sports</h2>

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

      {/* ================= FEATURED ================= */}
      <section className="section featured-section">
        <div className="container">
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

          <div className="featured-placeholder">
            <div className="placeholder-icon">🏟️</div>

            <h3>Discover your next game</h3>

            <p>Browse available courts and find the perfect place to play.</p>

            <Link to="/courts" className="btn btn-primary">
              Browse Courts
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="how-header">
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

      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div>
              <span className="eyebrow">READY TO PLAY?</span>

              <h2>Your next game is waiting.</h2>

              <p>Find a court and get on the field today.</p>
            </div>

            <Link to="/courts" className="btn cta-button">
              Find a Court →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
