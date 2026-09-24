import { useEffect, useState } from "react";

import { getOwnerBookings } from "../../services/bookingService";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getOwnerBookings();

        setBookings(result.data.bookings);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Không thể tải danh sách booking",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Đang tải booking...</p>
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
    <div className="owner-page page-container">
      <div className="owner-page-header">
        <div>
          <span>SUNDAY OWNER</span>

          <h1>Booking</h1>

          <p>Theo dõi các lượt đặt sân từ khách hàng.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="owner-empty">
          <h2>Chưa có booking nào</h2>

          <p>Khi khách hàng đặt sân, booking sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="owner-bookings-list">
          {bookings.map((booking) => (
            <div className="owner-booking-card" key={booking._id}>
              <div className="owner-booking-header">
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

              <div className="owner-booking-info">
                <div>
                  <span>Khách hàng</span>

                  <strong>{booking.user?.name}</strong>

                  <small>{booking.user?.email}</small>

                  {booking.user?.phone && <small>{booking.user.phone}</small>}
                </div>

                <div>
                  <span>Ngày</span>

                  <strong>{booking.bookingDate}</strong>
                </div>

                <div>
                  <span>Khung giờ</span>

                  <strong>
                    {booking.startTime} - {booking.endTime}
                  </strong>
                </div>

                <div>
                  <span>Doanh thu</span>

                  <strong>{booking.price.toLocaleString("vi-VN")}đ</strong>
                </div>

                <div>
                  <span>Thanh toán</span>

                  <strong>{booking.paymentStatus}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
