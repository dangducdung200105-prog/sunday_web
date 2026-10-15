import "./PlayerCard.css";

const sportLabels = {
  FOOTBALL: "Bóng đá",
  BADMINTON: "Cầu lông",
  TENNIS: "Tennis",
  BASKETBALL: "Bóng rổ",
  VOLLEYBALL: "Bóng chuyền",
  OTHER: "Khác",
};

const skillLabels = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung bình",
  ADVANCED: "Nâng cao",
};

function PlayerCard({ player }) {
  const user = player.user || {};
  const sports = player.sports || [];
  const preferredTimes = player.preferredTimes || [];

  const initials = (user.name || "U").trim().charAt(0).toUpperCase();

  return (
    <article className="player-card">
      {/* Cover */}
      <div className="player-card__cover">
        <div className="player-card__cover-pattern"></div>

        <div className="player-card__avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>

      {/* Main info */}
      <div className="player-card__body">
        <div className="player-card__identity">
          <div>
            <h2>{user.name || "Người chơi SUNDAY"}</h2>

            <p className="player-location">
              <span>⌖</span>

              {player.location?.district ? `${player.location.district}, ` : ""}

              {player.location?.city || "Hà Nội"}
            </p>
          </div>

          <span className="available-badge">
            <i></i>
            Đang tìm bạn
          </span>
        </div>

        {/* Sports */}
        <div className="player-section">
          <div className="player-section__title">Môn chơi</div>

          <div className="sport-tags">
            {sports.map((sport, index) => (
              <div className="sport-tag" key={`${sport.sportType}-${index}`}>
                <span>{sportLabels[sport.sportType] || sport.sportType}</span>

                <small>
                  {skillLabels[sport.skillLevel] || sport.skillLevel}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred time */}
        {preferredTimes.length > 0 && (
          <div className="player-section">
            <div className="player-section__title">Thời gian chơi</div>

            <div className="time-list">
              {preferredTimes.map((time, index) => (
                <span key={index}>{time}</span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {player.bio && (
          <div className="player-section">
            <div className="player-section__title">Giới thiệu</div>

            <p className="player-bio">{player.bio}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default PlayerCard;
