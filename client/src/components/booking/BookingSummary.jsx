const BookingSummary = ({
  court,
  selectedDate,
  selectedSlot,
  bookingError,
  bookingLoading,
  onConfirm,
}) => {
  if (!selectedSlot) {
    return (
      <div className="booking-summary booking-summary-empty">
        <div className="summary-icon">+</div>

        <h3>Chọn một khung giờ</h3>

        <p>Chọn thời gian phù hợp để tiếp tục đặt sân.</p>
      </div>
    );
  }

  return (
    <div className="booking-summary">
      <div className="booking-summary-header">
        <div>
          <span>03</span>

          <div>
            <h3>Xác nhận đặt sân</h3>
            <p>Kiểm tra thông tin trước khi đặt</p>
          </div>
        </div>
      </div>

      <div className="summary-court">
        <div className="summary-court-image">
          {court.images?.length > 0 ? (
            <img src={court.images[0]} alt={court.name} />
          ) : (
            <span>S</span>
          )}
        </div>

        <div>
          <strong>{court.name}</strong>
          <span>{court.sportType}</span>
        </div>
      </div>

      <div className="booking-summary-row">
        <span>Ngày chơi</span>
        <strong>{selectedDate}</strong>
      </div>

      <div className="booking-summary-row">
        <span>Khung giờ</span>

        <strong>
          {selectedSlot.startTime}
          {" - "}
          {selectedSlot.endTime}
        </strong>
      </div>

      <div className="booking-summary-total">
        <span>Tổng tiền</span>

        <strong>{court.pricePerHour.toLocaleString("vi-VN")}đ</strong>
      </div>

      {bookingError && <p className="booking-error">{bookingError}</p>}

      <button
        className="confirm-booking-button"
        onClick={onConfirm}
        disabled={bookingLoading}
      >
        {bookingLoading ? "Đang xử lý..." : "Xác nhận đặt sân"}
      </button>

      <small className="booking-note">
        Bạn sẽ được chuyển sang bước thanh toán sau khi xác nhận.
      </small>
    </div>
  );
};

export default BookingSummary;
