const CourtInfo = ({ court }) => {
  return (
    <div className="court-detail-info">
      <span className="court-detail-sport">{court.sportType}</span>

      <h1>{court.name}</h1>

      <p className="court-detail-address">{court.address}</p>

      {court.description && (
        <p className="court-detail-description">{court.description}</p>
      )}

      <div className="court-detail-price">
        <strong>{court.pricePerHour.toLocaleString("vi-VN")}đ</strong>

        <span>/ giờ</span>
      </div>

      {court.amenities?.length > 0 && (
        <div className="court-amenities">
          <h3>Tiện ích sân</h3>

          <div className="amenities-list">
            {court.amenities.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtInfo;
