import "./PlayerCard.css";

const sportLabels = { FOOTBALL: "Bóng đá", BADMINTON: "Cầu lông", TENNIS: "Quần vợt", BASKETBALL: "Bóng rổ", VOLLEYBALL: "Bóng chuyền", OTHER: "Khác" };
const skillLabels = { BEGINNER: "Cơ bản", INTERMEDIATE: "Trung bình", ADVANCED: "Nâng cao" };
const genderLabels = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };

function PlayerCard({ player }) {
  const user = player.user || {};
  const sports = player.sports || [];
  const preferredTimes = player.preferredTimes || [];
  const interests = player.interests || [];
  const name = player.displayName || user.name || "Người chơi SUNDAY";
  const initials = name.trim().charAt(0).toUpperCase();

  return <article className="player-card">
    <div className="player-card__cover"><div className="player-card__cover-pattern" /><div className="player-card__avatar">{user.avatar ? <img src={user.avatar} alt={name} /> : <span>{initials}</span>}</div></div>
    <div className="player-card__body">
      <div className="player-card__identity"><div><h2>{name}</h2><p className="player-location"><span>⌖</span>{player.location?.district ? `${player.location.district}, ` : ""}{player.location?.city || "Hà Nội"}</p></div><span className="available-badge"><i />Đang tìm bạn</span></div>
      {(genderLabels[player.gender] || player.ranking) && <div className="player-identity-meta">{genderLabels[player.gender] && <span>{genderLabels[player.gender]}</span>}{player.ranking && <span>Ranking: {player.ranking}</span>}</div>}
      {sports.length > 0 && <div className="player-section"><div className="player-section__title">Môn chơi</div><div className="sport-tags">{sports.map((sport, index) => <div className="sport-tag" key={`${sport.sportType}-${index}`}><span>{sportLabels[sport.sportType] || sport.sportType}</span><small>{skillLabels[sport.skillLevel] || sport.skillLevel}</small></div>)}</div></div>}
      {preferredTimes.length > 0 && <div className="player-section"><div className="player-section__title">Thời gian chơi</div><div className="time-list">{preferredTimes.map((time, index) => <span key={`${time}-${index}`}>{time}</span>)}</div></div>}
      {player.bio && <div className="player-section"><div className="player-section__title">Giới thiệu</div><p className="player-bio">{player.bio}</p></div>}
      {interests.length > 0 && <div className="player-section"><div className="player-section__title">Sở thích</div><div className="time-list">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div></div>}
    </div>
  </article>;
}

export default PlayerCard;
