import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">PLAY. BOOK. ENJOY.</div>

          <h1>
            Book your
            <br />
            <span>game.</span>
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
      </section>
    </main>
  );
};

export default Home;
