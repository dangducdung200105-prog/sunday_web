import { useEffect, useState } from "react";
import CourtCard from "../../components/court/CourtCard";
import { getCourts } from "../../services/courtService";

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await getCourts();

        setCourts(result.data.courts);
      } catch (error) {
        console.error(error);

        setError("Không thể tải danh sách sân");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

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
    <div className="courts-page">
      <div className="courts-header">
        <p>SUNDAY</p>

        <h1>Tìm sân chơi phù hợp</h1>

        <span>Chọn sân, chọn giờ và bắt đầu cuộc chơi.</span>
      </div>

      <div className="courts-grid">
        {courts.length > 0 ? (
          courts.map((court) => <CourtCard key={court._id} court={court} />)
        ) : (
          <p>Hiện chưa có sân nào.</p>
        )}
      </div>
    </div>
  );
};

export default Courts;
