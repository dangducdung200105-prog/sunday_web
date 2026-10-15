import { useEffect, useState } from "react";
import { getMyMatches, unmatchPlayer } from "../../services/matchService";
import { useAuth } from "../../context/AuthContext";
import "./Matches.css";

function Matches() {
  const { user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyMatches();

      const data = Array.isArray(result) ? result : result?.data || [];

      setMatches(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Không thể tải danh sách kết nối.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const getOtherUser = (match) => {
    return match.users?.find(
      (matchUser) => String(matchUser._id) !== String(user?._id),
    );
  };

  const handleUnmatch = async (matchId) => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy kết nối này?");

    if (!confirmed) return;

    try {
      await unmatchPlayer(matchId);

      setMatches((prev) => prev.filter((match) => match._id !== matchId));
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Không thể hủy kết nối.");
    }
  };

  if (loading) {
    return (
      <main className="matches-page">
        <div className="matches-loading">
          <div className="matches-spinner"></div>

          <p>Đang tải kết nối...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="matches-page">
      <div className="matches-container">
        <header className="matches-header">
          <div>
            <span>SUNDAY COMMUNITY</span>

            <h1>Bạn chơi của tôi</h1>

            <p>Những người bạn đã kết nối để cùng tham gia các trận đấu.</p>
          </div>

          <a href="/match" className="find-player-button">
            + Tìm bạn chơi
          </a>
        </header>

        {error && <div className="matches-error">{error}</div>}

        {!error && matches.length === 0 && (
          <div className="matches-empty">
            <div className="matches-empty__icon">+</div>

            <h2>Chưa có bạn chơi</h2>

            <p>
              Bắt đầu tìm kiếm những người có cùng sở thích thể thao với bạn.
            </p>

            <a href="/match">Tìm bạn chơi</a>
          </div>
        )}

        {!error && matches.length > 0 && (
          <section className="matches-grid">
            {matches.map((match) => {
              const otherUser = getOtherUser(match);

              if (!otherUser) {
                return null;
              }

              return (
                <article className="match-item" key={match._id}>
                  <div className="match-item__avatar">
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.name} />
                    ) : (
                      otherUser.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="match-item__content">
                    <div>
                      <h2>{otherUser.name}</h2>

                      <p>Thành viên SUNDAY</p>
                    </div>

                    <span className="match-status">● Đã kết nối</span>
                  </div>

                  <div className="match-item__footer">
                    <span>
                      Kết nối{" "}
                      {match.matchedAt
                        ? new Date(match.matchedAt).toLocaleDateString("vi-VN")
                        : ""}
                    </span>

                    <div>
                      <button className="chat-button" disabled>
                        Nhắn tin
                      </button>

                      <button
                        className="unmatch-button"
                        onClick={() => handleUnmatch(match._id)}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default Matches;
