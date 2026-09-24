import { useEffect, useState } from "react";

import {
  getAllCourtsAdmin,
  approveCourt,
  rejectCourt,
} from "../../services/adminService";

const FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
];

const AdminCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchCourts = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filter === "pending") params.isApproved = "false";
      if (filter === "approved") params.isApproved = "true";

      const result = await getAllCourtsAdmin(params);

      setCourts(result.data.courts);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Không thể tải danh sách sân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleApprove = async (courtId) => {
    try {
      await approveCourt(courtId);

      setCourts((prev) =>
        prev.map((c) =>
          c._id === courtId
            ? { ...c, isApproved: true, status: "ACTIVE" }
            : c,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể duyệt sân");
    }
  };

  const handleReject = async (courtId) => {
    const confirmed = window.confirm("Từ chối / gỡ duyệt sân này?");

    if (!confirmed) return;

    try {
      await rejectCourt(courtId);

      setCourts((prev) =>
        prev.map((c) =>
          c._id === courtId
            ? { ...c, isApproved: false, status: "INACTIVE" }
            : c,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể từ chối sân");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Duyệt sân</h1>

        <p>Kiểm duyệt sân do chủ sân tạo trước khi hiển thị công khai.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={filter === f.value ? "active" : ""}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
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
                <th>Tên sân</th>
                <th>Chủ sân</th>
                <th>Loại</th>
                <th>Địa chỉ</th>
                <th>Giá/giờ</th>
                <th>Duyệt</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {courts.length === 0 ? (
                <tr>
                  <td colSpan={8}>Không có sân nào.</td>
                </tr>
              ) : (
                courts.map((court) => (
                  <tr key={court._id}>
                    <td>{court.name}</td>
                    <td>{court.owner?.name || "-"}</td>
                    <td>{court.sportType}</td>
                    <td>{court.address}</td>
                    <td>{court.pricePerHour.toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span
                        className={`admin-badge ${court.isApproved ? "active" : "pending"}`}
                      >
                        {court.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                    </td>
                    <td>{court.status}</td>
                    <td className="admin-table-actions">
                      {!court.isApproved && (
                        <button onClick={() => handleApprove(court._id)}>
                          Duyệt
                        </button>
                      )}

                      {court.isApproved && (
                        <button onClick={() => handleReject(court._id)}>
                          Gỡ duyệt
                        </button>
                      )}
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

export default AdminCourts;
