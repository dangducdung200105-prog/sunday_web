import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBookingById, cancelBooking } from "../../services/bookingService";
import { createPayment } from "../../services/paymentService";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getBookingById(id);

        setBooking(result.data.booking);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Không thể tải thông tin booking",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setError("");

      const result = await createPayment({
        bookingId: booking._id,
        method: "VNPAY",
      });

      const paymentUrl = result.data.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Không nhận được link thanh toán");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Không thể tạo thanh toán",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy booking này?");

    if (!confirmed) return;

    try {
      setCancelLoading(true);

      const result = await cancelBooking(id);

      setBooking(result.data.booking);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Không thể hủy booking");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">Đang tải booking...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Không thể tải booking</h2>
          <p>{error}</p>

          <Link to="/my-bookings">Quay lại lịch đặt sân</Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const court = booking.court;

  return (
    <div className="page-container booking-detail-page">
      <div className="booking-detail-header">
        <div>
          <Link to="/my-bookings" className="back-link">
            ← Lịch đặt sân
          </Link>

          <h1>Chi tiết booking</h1>

          <p>Thông tin chi tiết về lịch đặt sân của bạn</p>
        </div>
      </div>

      <div className="booking-detail-layout">
        <div className="booking-detail-card">
          <div className="booking-detail-card-header">
            <div>
              <span className="detail-label">SÂN THỂ THAO</span>

              <h2>{court?.name || "Không xác định"}</h2>
            </div>

            <span
              className={`booking-status status-${booking.status?.toLowerCase()}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="booking-info-grid">
            <div className="booking-info-item">
              <span>Loại sân</span>
              <strong>{court?.sportType || "-"}</strong>
            </div>

            <div className="booking-info-item">
              <span>Địa chỉ</span>
              <strong>{court?.address || "-"}</strong>
            </div>

            <div className="booking-info-item">
              <span>Ngày đặt</span>
              <strong>{booking.bookingDate}</strong>
            </div>

            <div className="booking-info-item">
              <span>Thời gian</span>
              <strong>
                {booking.startTime} - {booking.endTime}
              </strong>
            </div>
          </div>

          <div className="booking-payment-section">
            <div>
              <span>Trạng thái thanh toán</span>

              <strong
                className={`payment-status payment-${booking.paymentStatus?.toLowerCase()}`}
              >
                {booking.paymentStatus}
              </strong>
            </div>

            <div>
              <span>Tổng tiền</span>

              <strong className="booking-total">
                {Number(booking.price || 0).toLocaleString("vi-VN")} ₫
              </strong>
            </div>
          </div>

          <div className="booking-detail-actions">
            {booking.status === "PENDING" &&
              booking.paymentStatus === "UNPAID" && (
                <button
                  className="primary-button"
                  onClick={() => {
                    // Payment sẽ nối vào đây
                    alert(
                      "Chức năng thanh toán sẽ được hoàn thiện ở bước tiếp theo.",
                    );
                  }}
                >
                  Thanh toán
                </button>
              )}

            {booking.status === "PENDING" &&
              booking.paymentStatus === "UNPAID" && (
                <button
                  className="primary-button"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Đang chuyển đến VNPAY..." : "Thanh toán"}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
