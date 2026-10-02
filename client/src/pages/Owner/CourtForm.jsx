import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Owner.css";
import {
  createCourt,
  getCourtById,
  updateCourt,
} from "../../services/courtService";

const initialForm = {
  name: "",
  description: "",
  sportType: "FOOTBALL",
  address: "",
  pricePerHour: "",
  slotDurationMinutes: 60,
  openingTime: "08:00",
  closingTime: "22:00",
  images: "",
  amenities: "",
};

const CourtForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [loadingCourt, setLoadingCourt] = useState(isEditMode);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchCourt = async () => {
      try {
        const result = await getCourtById(id);

        const court = result.data.court;

        setFormData({
          name: court.name || "",
          description: court.description || "",
          sportType: court.sportType || "FOOTBALL",
          address: court.address || "",
          pricePerHour: court.pricePerHour || "",
          slotDurationMinutes: court.slotDurationMinutes || 60,
          openingTime: court.openingTime || "08:00",
          closingTime: court.closingTime || "22:00",
          images: court.images?.join(", ") || "",
          amenities: court.amenities?.join(", ") || "",
        });
      } catch (error) {
        console.error(error);

        setError("Không thể tải thông tin sân");
      } finally {
        setLoadingCourt(false);
      }
    };

    fetchCourt();
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const courtData = {
        ...formData,

        pricePerHour: Number(formData.pricePerHour),

        slotDurationMinutes: Number(formData.slotDurationMinutes),

        images: formData.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        await updateCourt(id, courtData);
      } else {
        await createCourt(courtData);
      }

      navigate("/owner/courts");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Không thể lưu thông tin sân");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCourt) {
    return (
      <div className="page-container">
        <p>Đang tải thông tin sân...</p>
      </div>
    );
  }

  return (
    <div className="owner-form-page owner-shell page-container">
      <div className="owner-form-hero">
        <span>SUNDAY OWNER</span>

        <h1>{isEditMode ? "Chỉnh sửa sân" : "Thêm sân mới"}</h1>

        <p>
          {isEditMode
            ? "Cập nhật thông tin sân của bạn."
            : "Tạo một sân mới để bắt đầu nhận booking."}
        </p>
      </div>

      <form className="court-form owner-panel" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="form-section">
          <h2>Thông tin cơ bản</h2>

          <div className="form-group">
            <label>Tên sân</label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Sân bóng Sunday"
              required
            />
          </div>

          <div className="form-group">
            <label>Loại sân</label>

            <select
              name="sportType"
              value={formData.sportType}
              onChange={handleChange}
            >
              <option value="FOOTBALL">Football</option>

              <option value="BADMINTON">Badminton</option>

              <option value="TENNIS">Tennis</option>

              <option value="BASKETBALL">Basketball</option>

              <option value="VOLLEYBALL">Volleyball</option>

              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="VD: Cầu Giấy, Hà Nội"
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả về sân..."
              rows="5"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Giá & thời gian</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Giá / giờ</label>

              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                min="0"
                placeholder="150000"
                required
              />
            </div>

            <div className="form-group">
              <label>Thời lượng slot</label>

              <select
                name="slotDurationMinutes"
                value={formData.slotDurationMinutes}
                onChange={handleChange}
              >
                <option value="30">30 phút</option>

                <option value="60">60 phút</option>

                <option value="90">90 phút</option>

                <option value="120">120 phút</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mở cửa</label>

              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Đóng cửa</label>

              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Hình ảnh & tiện ích</h2>

          <div className="form-group">
            <label>URL hình ảnh</label>

            <input
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://..., https://..."
            />

            <small>Tạm thời nhập nhiều URL, cách nhau bằng dấu phẩy.</small>
          </div>

          <div className="form-group">
            <label>Tiện ích</label>

            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Wifi, Parking, WC"
            />

            <small>Ví dụ: Wifi, Parking, WC</small>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="form-cancel-button"
            onClick={() => navigate("/owner/courts")}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="owner-primary-button"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Tạo sân"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourtForm;
