const SlotGrid = ({ slots, selectedSlot, onSelect, loading }) => {
  return (
    <div className="slot-section">
      <div className="booking-title">
        <span>02</span>

        <div>
          <h2>Chọn khung giờ</h2>

          <p>Các khung giờ còn trống</p>
        </div>
      </div>

      {loading ? (
        <div className="slot-loading">Đang tải khung giờ...</div>
      ) : slots.length === 0 ? (
        <div className="slot-empty">Không có khung giờ nào.</div>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => {
            const isBooked = slot.status === "BOOKED";

            const isSelected = selectedSlot?.startTime === slot.startTime;

            return (
              <button
                key={slot.startTime}
                disabled={isBooked}
                onClick={() => {
                  if (!isBooked) {
                    onSelect(slot);
                  }
                }}
                className={
                  isBooked
                    ? "slot booked"
                    : isSelected
                      ? "slot selected"
                      : "slot available"
                }
              >
                <span>{slot.startTime}</span>

                <small>{slot.endTime}</small>

                {isBooked && <em>Đã đặt</em>}

                {!isBooked && isSelected && <em>Đã chọn</em>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SlotGrid;
