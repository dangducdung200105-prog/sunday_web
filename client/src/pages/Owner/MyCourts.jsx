import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyCourts, deleteCourt } from "../../services/courtService";

const MyCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await getMyCourts();

        setCourts(result.data.courts);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Không thể tải danh sách sân",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleDelete = async (courtId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sân này?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourt(courtId);

      setCourts((prevCourts) =>
        prevCourts.filter((court) => court._id !== courtId),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể xóa sân");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Đang tải sân...</p>
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

          <h1>Quản lý sân</h1>

          <p>Quản lý những sân thể thao bạn đang vận hành.</p>
        </div>

        <Link to="/owner/courts/create" className="owner-primary-button">
          + Thêm sân
        </Link>
      </div>

      {courts.length === 0 ? (
        <div className="owner-empty">
          <h2>Bạn chưa có sân nào</h2>

          <p>Hãy tạo sân đầu tiên để bắt đầu nhận booking.</p>

          <Link to="/owner/courts/create" className="owner-primary-button">
            Tạo sân đầu tiên
          </Link>
        </div>
      ) : (
        <div className="owner-courts-grid">
          {courts.map((court) => (
            <div className="owner-court-card" key={court._id}>
              <div className="owner-court-image">
                {court.images?.length > 0 ? (
                  <img src={court.images[0]} alt={court.name} />
                ) : (
                  <span>SUNDAY</span>
                )}
              </div>

              <div className="owner-court-content">
                <div className="owner-court-top">
                  <span>{court.sportType}</span>

                  <span
                    className={
                      court.isApproved
                        ? "court-status approved"
                        : "court-status pending"
                    }
                  >
                    {court.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                </div>

                <h2>{court.name}</h2>

                <p>{court.address}</p>

                <strong>
                  {court.pricePerHour.toLocaleString("vi-VN")}đ / giờ
                </strong>

                <div className="owner-court-actions">
                  <Link to={`/owner/courts/${court._id}/edit`}>Chỉnh sửa</Link>

                  <button onClick={() => handleDelete(court._id)}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourts;
