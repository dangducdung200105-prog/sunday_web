import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyBookings, cancelBooking } from "../../services/bookingService";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getMyBookings();

        setBookings(result.data.bookings);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Không thể tải lịch đặt sân");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy booking này?");

    if (!confirmed) {
      return;
    }

    try {
      await cancelBooking(bookingId);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "CANCELLED",
              }
            : booking,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể hủy booking");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Đang tải lịch đặt sân...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span>SUNDAY</span>

        <h1>Lịch đặt sân của tôi</h1>

        <p>Quản lý những sân bạn đã đặt.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <h2>Chưa có booking nào</h2>

          <p>Hãy tìm một sân và bắt đầu cuộc chơi.</p>

          <Link to="/courts">Tìm sân</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-main">
                <div>
                  <span className="booking-sport">
                    {booking.court?.sportType}
                  </span>

                  <h2>{booking.court?.name}</h2>

                  <p>{booking.court?.address}</p>
                </div>

                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div>
                  <span>Ngày</span>
                  <strong>{booking.bookingDate}</strong>
                </div>

                <div>
                  <span>Thời gian</span>
                  <strong>
                    {booking.startTime}
                    {" - "}
                    {booking.endTime}
                  </strong>
                </div>

                <div>
                  <span>Giá</span>
                  <strong>{booking.price.toLocaleString("vi-VN")}đ</strong>
                </div>

                <div>
                  <span>Thanh toán</span>
                  <strong>{booking.paymentStatus}</strong>
                </div>
              </div>

              {booking.status !== "CANCELLED" &&
                booking.status !== "COMPLETED" && (
                  <button
                    className="cancel-booking-button"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Hủy booking
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
