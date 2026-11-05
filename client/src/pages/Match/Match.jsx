import { useEffect, useState, useMemo } from "react";
import PlayerCard from "../../components/match/PlayerCard";
import { getPlayerProfiles, swipePlayer } from "../../services/matchService";
import { Link } from "react-router-dom";
import "./Match.css";

const sports = [
  { value: "", label: "Tất cả môn" },
  { value: "FOOTBALL", label: "Bóng đá" },
  { value: "BADMINTON", label: "Cầu lông" },
  { value: "TENNIS", label: "Quần vợt" },
  { value: "BASKETBALL", label: "Bóng rổ" },
  { value: "VOLLEYBALL", label: "Bóng chuyền" },
];

const skills = [
  { value: "", label: "Mọi trình độ" },
  { value: "BEGINNER", label: "Cơ bản" },
  { value: "INTERMEDIATE", label: "Trung bình" },
  { value: "ADVANCED", label: "Nâng cao" },
];

const quickDistricts = ["Cầu Giấy", "Đống Đa", "Thanh Xuân", "Ba Đình", "Nam Từ Liêm", "Tây Hồ"];

const sportLabels = {
  FOOTBALL: "Bóng đá",
  BADMINTON: "Cầu lông",
  TENNIS: "Quần vợt",
  BASKETBALL: "Bóng rổ",
  VOLLEYBALL: "Bóng chuyền",
  OTHER: "Khác",
};

const skillLabels = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung bình",
  ADVANCED: "Nâng cao",
};

function Match() {
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sportType, setSportType] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [district, setDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" hoặc "swipe"

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [swipingId, setSwipingId] = useState(null);
  const [error, setError] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const currentPlayer = players[currentIndex];

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPlayerProfiles({
        sport: sportType || undefined,
        skillLevel: skillLevel || undefined,
        district: district || undefined,
        search: searchTerm || undefined,
      });

      const data = Array.isArray(result) ? result : result?.data || [];
      setPlayers(data);
      setCurrentIndex(0);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách người chơi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [sportType, skillLevel, district]);

  // Tìm kiếm khi nhấn Enter hoặc sau khi gõ
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPlayers();
  };

  const handleSwipe = async (action, targetPlayer = null) => {
    const playerToSwipe = targetPlayer || currentPlayer;
    if (!playerToSwipe || actionLoading) return;

    const targetUserId = playerToSwipe.user?._id || playerToSwipe.user?.id;
    if (!targetUserId) return;

    try {
      setActionLoading(true);
      setSwipingId(targetUserId);

      const result = await swipePlayer(targetUserId, action);

      if (action === "LIKE" && result?.matched) {
        setMatchResult(playerToSwipe);
      }

      // Loại bỏ người chơi đã swipe khỏi danh sách hiển thị
      setPlayers((prev) => prev.filter((p) => (p.user?._id || p.user?.id) !== targetUserId));

      if (viewMode === "swipe") {
        setCurrentIndex((prev) => (prev >= players.length - 1 ? 0 : prev));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể thực hiện thao tác.");
    } finally {
      setActionLoading(false);
      setSwipingId(null);
    }
  };

  // Phân trang danh sách người chơi ở chế độ Grid
  const paginatedPlayers = useMemo(() => {
    if (viewMode !== "grid") return players;
    return players.slice(0, page * pageSize);
  }, [players, page, viewMode]);

  const hasMore = paginatedPlayers.length < players.length;

  return (
    <main className="match-page">
      <div className="match-container">
        {/* HEADER */}
        <header className="match-header">
          <div>
            <span className="match-eyebrow">CỘNG ĐỒNG THỂ THAO SUNDAY</span>
            <h1>Tìm người chơi cùng</h1>
            <p>
              Kết nối với các thành viên thể thao tại Hà Nội cùng môn chơi, trình độ và khung giờ phù hợp với bạn.
            </p>
          </div>

          <div className="match-header-stats-box">
            <div className="stat-pill">
              <span className="live-dot"></span>
              <strong>{players.length}</strong>
              <span>người chơi sẵn sàng</span>
            </div>
          </div>
        </header>

        {/* THÔNG BÁO HOÀN THIỆN HỒ SƠ */}
        <Link className="match-profile-link" to="/profile">
          <div className="profile-link-content">
            <span className="profile-link-icon">💡</span>
            <span>
              Hoàn thiện hồ sơ thể thao để mọi người thấy tên, ranking, môn sở trường và khung giờ hoạt động của bạn.
            </span>
          </div>
          <strong>Cập nhật ngay →</strong>
        </Link>

        {/* KHU VỰC TÌM KIẾM & BỘ LỌC */}
        <section className="match-filters-panel">
          <form onSubmit={handleSearchSubmit} className="search-bar-row">
            <div className="search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên người chơi, khu vực, sở thích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchTerm("");
                    loadPlayers();
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <button type="submit" className="search-submit-btn">
              Tìm kiếm
            </button>

            {/* Nút chuyển chế độ xem */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Xem dạng lưới nhiều người"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Dạng lưới</span>
              </button>

              <button
                type="button"
                className={`toggle-btn ${viewMode === "swipe" ? "active" : ""}`}
                onClick={() => setViewMode("swipe")}
                title="Khám phá từng người"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>Khám phá</span>
              </button>
            </div>
          </form>

          {/* DÒNG SELECT BỘ LỌC */}
          <div className="filter-controls-row">
            <div className="filter-select-group">
              <label>Môn thể thao:</label>
              <select value={sportType} onChange={(e) => setSportType(e.target.value)}>
                {sports.map((sport) => (
                  <option key={sport.value} value={sport.value}>
                    {sport.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <label>Trình độ:</label>
              <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                {skills.map((skill) => (
                  <option key={skill.value} value={skill.value}>
                    {skill.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <label>Khu vực:</label>
              <input
                type="text"
                placeholder="VD: Cầu Giấy, Đống Đa..."
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>

            {(sportType || skillLevel || district || searchTerm) && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={() => {
                  setSportType("");
                  setSkillLevel("");
                  setDistrict("");
                  setSearchTerm("");
                }}
              >
                Xóa bộ lọc ✕
              </button>
            )}
          </div>

          {/* QUICK DISTRICT TAGS */}
          <div className="quick-districts-row">
            <span className="quick-label">Khu vực nhanh:</span>
            <div className="quick-tags">
              {quickDistricts.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`district-chip ${district.toLowerCase().includes(d.toLowerCase()) ? "active" : ""}`}
                  onClick={() => setDistrict(district === d ? "" : d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="match-state-box">
            <div className="match-spinner"></div>
            <h3>Đang tải danh sách người chơi...</h3>
            <p>SUNDAY đang đồng bộ dữ liệu người dùng yêu thích thể thao.</p>
          </div>
        )}

        {!loading && error && (
          <div className="match-state-box match-error">
            <div className="state-icon">!</div>
            <h3>Không thể tải dữ liệu</h3>
            <p>{error}</p>
            <button onClick={loadPlayers} className="match-primary-btn">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="match-state-box empty-state">
            <div className="state-icon">🔍</div>
            <h2>Không tìm thấy người chơi phù hợp</h2>
            <p>Hãy thử mở rộng khu vực, đổi môn thể thao hoặc xóa bộ lọc để xem toàn bộ người chơi.</p>
            <button
              onClick={() => {
                setSportType("");
                setSkillLevel("");
                setDistrict("");
                setSearchTerm("");
              }}
              className="match-primary-btn"
            >
              Xem tất cả người chơi
            </button>
          </div>
        )}

        {/* CONTENT CHẾ ĐỘ 1: DẠNG LƯỚI (GRID VIEW) */}
        {!loading && !error && players.length > 0 && viewMode === "grid" && (
          <section className="match-grid-section">
            <div className="grid-header-info">
              <span>Hiển thị <strong>{paginatedPlayers.length}</strong> / <strong>{players.length}</strong> người chơi</span>
            </div>

            <div className="players-cards-grid">
              {paginatedPlayers.map((player) => {
                const u = player.user || {};
                const name = player.displayName || u.name || "Người chơi SUNDAY";
                const initials = name.trim().charAt(0).toUpperCase();
                const pSports = player.sports || [];
                const pTimes = player.preferredTimes || [];
                const pDist = player.location?.district || "Hà Nội";
                const pId = u._id || u.id;
                const isSwiping = swipingId === pId;

                return (
                  <div key={pId} className="grid-player-card">
                    <div className="card-top-banner">
                      <div className="card-banner-pattern" />
                      <div className="card-avatar-bubble">
                        {u.avatar ? <img src={u.avatar} alt={name} /> : <span>{initials}</span>}
                      </div>
                      <span className="live-badge">Đang tìm bạn</span>
                    </div>

                    <div className="card-inner-body">
                      <h3 className="card-player-name" title={name}>{name}</h3>
                      <div className="card-player-location">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{pDist}</span>
                      </div>

                      {/* MÔN THỂ THAO */}
                      <div className="card-sports-row">
                        {pSports.slice(0, 2).map((sp, idx) => (
                          <span key={idx} className="sport-badge">
                            {sportLabels[sp.sportType] || sp.sportType}
                            <small>({skillLabels[sp.skillLevel] || sp.skillLevel})</small>
                          </span>
                        ))}
                      </div>

                      {/* GIỜ CHƠI */}
                      {pTimes.length > 0 && (
                        <div className="card-times-snippet">
                          <span className="time-icon">⏰</span>
                          <span>{pTimes[0]}</span>
                        </div>
                      )}

                      {/* BIO */}
                      <p className="card-bio-text">
                        {player.bio || "Thành viên yêu thích rèn luyện thể thao cùng cộng đồng SUNDAY."}
                      </p>

                      {/* ACTIONS */}
                      <div className="card-actions-row">
                        <button
                          type="button"
                          className="card-pass-btn"
                          disabled={actionLoading}
                          onClick={() => handleSwipe("PASS", player)}
                          title="Bỏ qua"
                        >
                          ✕ Bỏ qua
                        </button>

                        <button
                          type="button"
                          className="card-connect-btn"
                          disabled={actionLoading}
                          onClick={() => handleSwipe("LIKE", player)}
                          title="Gửi kết nối"
                        >
                          {isSwiping ? "Đang gửi..." : "⚡ Kết nối"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Xem thêm {Math.min(pageSize, players.length - paginatedPlayers.length)} người chơi khác ↓
                </button>
              </div>
            )}
          </section>
        )}

        {/* CONTENT CHẾ ĐỘ 2: KHÁM PHÁ (SWIPE VIEW) */}
        {!loading && !error && currentPlayer && viewMode === "swipe" && (
          <section className="match-discovery">
            <div className="discovery-label">
              <span>KHÁM PHÁ TỪNG BẠN CHƠI</span>
              <span className="discovery-counter">
                {currentIndex + 1} / {players.length}
              </span>
            </div>

            <div className="match-card-wrapper">
              <PlayerCard player={currentPlayer} />

              <div className="match-actions">
                <button
                  className="match-action match-action--pass"
                  onClick={() => handleSwipe("PASS")}
                  disabled={actionLoading}
                >
                  <span className="action-icon">×</span>
                  <span>Bỏ qua</span>
                </button>

                <button
                  className="match-action match-action--connect"
                  onClick={() => handleSwipe("LIKE")}
                  disabled={actionLoading}
                >
                  <span>Kết nối ngay</span>
                  <span className="action-icon">⚡</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* MODAL KẾT NỐI THÀNH CÔNG */}
      {matchResult && (
        <div className="match-modal-overlay">
          <div className="match-modal">
            <div className="match-modal-icon">🎉</div>
            <span className="match-modal-label">KẾT NỐI THÀNH CÔNG</span>
            <h2>Bạn đã tìm được bạn chơi!</h2>
            <p>
              Bạn và <strong>{matchResult.displayName || matchResult.user?.name}</strong> đã kết nối thành công để cùng chơi thể thao.
            </p>

            <div className="match-modal-actions">
              <button
                className="secondary-button"
                onClick={() => setMatchResult(null)}
              >
                Tiếp tục tìm bạn
              </button>

              <button
                className="primary-button"
                onClick={() => (window.location.href = "/matches")}
              >
                Xem bạn chơi của tôi →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Match;
