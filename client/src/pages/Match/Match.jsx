import { useEffect, useState } from "react";
import PlayerCard from "../../components/match/PlayerCard";
import { getPlayerProfiles, swipePlayer } from "../../services/matchService";
import "./Match.css";

const sports = [
  { value: "", label: "Tất cả môn" },
  { value: "FOOTBALL", label: "Bóng đá" },
  { value: "BADMINTON", label: "Cầu lông" },
  { value: "TENNIS", label: "Tennis" },
  { value: "BASKETBALL", label: "Bóng rổ" },
  { value: "VOLLEYBALL", label: "Bóng chuyền" },
];

const skills = [
  { value: "", label: "Mọi trình độ" },
  { value: "BEGINNER", label: "Cơ bản" },
  { value: "INTERMEDIATE", label: "Trung bình" },
  { value: "ADVANCED", label: "Nâng cao" },
];

function Match() {
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sportType, setSportType] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [district, setDistrict] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const currentPlayer = players[currentIndex];

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPlayerProfiles({
        sportType: sportType || undefined,
        skillLevel: skillLevel || undefined,
        district: district || undefined,
      });

      const data = Array.isArray(result) ? result : result?.data || [];

      setPlayers(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Không thể tải danh sách người chơi.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [sportType, skillLevel, district]);

  const handleSwipe = async (action) => {
    if (!currentPlayer || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      const targetUserId = currentPlayer.user?._id || currentPlayer.user?.id;

      const result = await swipePlayer(targetUserId, action);

      if (action === "LIKE" && result?.matched) {
        setMatchResult(currentPlayer);
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Không thể thực hiện thao tác.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="match-page">
      <div className="match-container">
        {/* HEADER */}

        <header className="match-header">
          <div>
            <span className="match-eyebrow">SUNDAY COMMUNITY</span>

            <h1>Tìm người chơi cùng</h1>

            <p>
              Kết nối với những người có cùng môn thể thao và thời gian chơi với
              bạn.
            </p>
          </div>

          <div className="match-header-stat">
            <strong>{players.length}</strong>

            <span>người chơi</span>
          </div>
        </header>

        {/* FILTER */}

        <section className="match-filters">
          <div className="filter-title">
            <strong>Tìm kiếm phù hợp</strong>

            <span>Lọc theo nhu cầu chơi của bạn</span>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Môn thể thao</label>

              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
              >
                {sports.map((sport) => (
                  <option key={sport.value} value={sport.value}>
                    {sport.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Trình độ</label>

              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                {skills.map((skill) => (
                  <option key={skill.value} value={skill.value}>
                    {skill.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Khu vực</label>

              <input
                type="text"
                placeholder="VD: Cầu Giấy"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}

        {loading && (
          <div className="match-state">
            <div className="loading-spinner"></div>

            <h3>Đang tìm người chơi</h3>

            <p>SUNDAY đang tìm những người phù hợp với bạn.</p>
          </div>
        )}

        {!loading && error && (
          <div className="match-state match-error">
            <div className="state-icon">!</div>

            <h3>Không thể tải dữ liệu</h3>

            <p>{error}</p>

            <button onClick={loadPlayers}>Thử lại</button>
          </div>
        )}

        {!loading && !error && !currentPlayer && (
          <div className="match-state empty-match">
            <div className="state-icon">+</div>

            <h2>Không tìm thấy người chơi</h2>

            <p>Hãy thử mở rộng khu vực hoặc thay đổi bộ lọc.</p>

            <button
              onClick={() => {
                setSportType("");
                setSkillLevel("");
                setDistrict("");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {!loading && !error && currentPlayer && (
          <section className="match-discovery">
            <div className="discovery-label">
              <span>GỢI Ý CHO BẠN</span>

              <span>
                {currentIndex + 1}
                {" / "}
                {players.length}
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
                  <span>Kết nối</span>

                  <span className="action-icon">→</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* MATCH MODAL */}

      {matchResult && (
        <div className="match-modal-overlay">
          <div className="match-modal">
            <div className="match-modal-icon">✓</div>

            <span className="match-modal-label">KẾT NỐI THÀNH CÔNG</span>

            <h2>Bạn đã tìm được bạn chơi</h2>

            <p>
              Bạn và <strong>{matchResult.user?.name}</strong> đều muốn kết nối
              để chơi thể thao cùng nhau.
            </p>

            <div className="match-modal-actions">
              <button
                className="secondary-button"
                onClick={() => setMatchResult(null)}
              >
                Tiếp tục tìm
              </button>

              <button
                className="primary-button"
                onClick={() => (window.location.href = "/matches")}
              >
                Xem kết nối
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Match;
