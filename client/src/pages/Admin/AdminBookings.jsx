import { useEffect, useState } from "react";

import {
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
} from "../../services/adminService";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const params = {};

      if (statusFilter) params.status = statusFilter;

      const result = await getAllBookingsAdmin(params);

      setBookings(result.data.bookings);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Không thể tải đơn đặt sân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (booking, newStatus) => {
    if (newStatus === booking.status) return;

    try {
      await updateBookingStatusAdmin(booking._id, newStatus);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: newStatus } : b,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể cập nhật đơn");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Quản lý đơn đặt sân</h1>

        <p>Toàn bộ đơn đặt sân trong hệ thống.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <button
            className={statusFilter === "" ? "active" : ""}
            onClick={() => setStatusFilter("")}
          >
            Tất cả
          </button>

          {STATUSES.map((s) => (
            <button
              key={s}
              className={statusFilter === s ? "active" : ""}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sân</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Giá</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7}>Không có đơn nào.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking.user?.name}
                      <br />
                      <small>{booking.user?.email}</small>
                    </td>
                    <td>{booking.court?.name}</td>
                    <td>{booking.bookingDate}</td>
                    <td>
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td>{booking.price.toLocaleString("vi-VN")}đ</td>
                    <td>{booking.paymentStatus}</td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
