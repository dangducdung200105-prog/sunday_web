import { Link, useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card">
          <div className="payment-result-icon">✓</div>

          <h1>Thanh toán thành công</h1>

          <p>Booking của bạn đã được thanh toán thành công.</p>

          <Link to="/my-bookings" className="primary-button">
            Xem lịch đặt sân
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card">
          <div className="payment-result-icon">!</div>

          <h1>Đang xử lý thanh toán</h1>

          <p>
            Giao dịch đang được hệ thống xử lý. Vui lòng kiểm tra lại lịch đặt
            sân.
          </p>

          <Link to="/my-bookings" className="primary-button">
            Xem lịch đặt sân
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        <div className="payment-result-icon">!</div>

        <h1>Thanh toán chưa hoàn tất</h1>

        <p>
          Giao dịch chưa được hoàn tất. Bạn có thể quay lại booking để thử lại.
        </p>

        <Link to="/my-bookings" className="secondary-button">
          Quay lại lịch đặt sân
        </Link>
      </div>
    </div>
  );
};

export default PaymentResult;
