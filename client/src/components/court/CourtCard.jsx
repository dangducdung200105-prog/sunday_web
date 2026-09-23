import { Link } from "react-router-dom";

const CourtCard = ({ court }) => {
  return (
    <div className="court-card">
      <div className="court-card-image">
        {court.images?.length > 0 ? (
          <img src={court.images[0]} alt={court.name} />
        ) : (
          <div className="court-card-placeholder">SUNDAY</div>
        )}
      </div>

      <div className="court-card-content">
        <span className="court-sport">{court.sportType}</span>

        <h3>{court.name}</h3>

        <p className="court-address">{court.address}</p>

        <div className="court-card-footer">
          <strong>
            {court.pricePerHour.toLocaleString("vi-VN")}đ<span>/giờ</span>
          </strong>

          <Link to={`/courts/${court._id}`}>Xem sân</Link>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
