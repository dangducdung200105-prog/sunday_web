const DatePicker = ({ selectedDate, onChange }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="date-picker">
      <div className="booking-title">
        <span>01</span>

        <div>
          <h2>Chọn ngày chơi</h2>
          <p>Chọn ngày bạn muốn đặt sân</p>
        </div>
      </div>

      <input
        type="date"
        value={selectedDate}
        min={today}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default DatePicker;
