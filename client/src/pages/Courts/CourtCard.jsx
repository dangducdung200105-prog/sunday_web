import { Link } from "react-router-dom";
import "./CourtCard.css";

const sportLabels = {
  FOOTBALL: "Football",
  BADMINTON: "Badminton",
  TENNIS: "Tennis",
  BASKETBALL: "Basketball",
  VOLLEYBALL: "Volleyball",
  OTHER: "Other",
};

const sportIcons = {
  FOOTBALL: "⚽",
  BADMINTON: "🏸",
  TENNIS: "🎾",
  BASKETBALL: "🏀",
  VOLLEYBALL: "🏐",
  OTHER: "🏟️",
};

const CourtCard = ({ court }) => {
  console.log("COURT CARD:", court);
  const image =
    court.images?.length > 0
      ? court.images[0]
      : "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80";

  return (
    <article
      className="court-card"
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "16px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Image */}

      <Link to={`/courts/${court._id}`} className="court-card-image-wrapper">
        <img src={image} alt={court.name} className="court-card-image" />

        <div className="court-card-overlay"></div>

        <span className="court-card-sport">
          {sportIcons[court.sportType]}
          {sportLabels[court.sportType] || court.sportType}
        </span>
      </Link>

      {/* Content */}

      <div className="court-card-content">
        <div className="court-card-title-row">
          <Link to={`/courts/${court._id}`}>
            <h3>{court.name}</h3>
          </Link>

          <span className="court-rating">★ 4.8</span>
        </div>

        <p className="court-location">
          <span>⌖</span>
          {court.address}
        </p>

        {court.description && (
          <p className="court-description">{court.description}</p>
        )}

        {/* Amenities */}

        {court.amenities?.length > 0 && (
          <div className="court-amenities">
            {court.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        )}

        {/* Footer */}

        <div className="court-card-footer">
          <div className="court-price">
            <strong>
              {Number(court.pricePerHour).toLocaleString("vi-VN")}₫
            </strong>

            <span>/ hour</span>
          </div>

          <Link to={`/courts/${court._id}`} className="court-view-button">
            View court →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CourtCard;
