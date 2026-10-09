import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "../../components/map/LocationPicker";
import "./Owner.css";
import {
  createCourt,
  getCourtById,
  updateCourt,
  uploadCourtImages,
} from "../../services/courtService";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  name: "",
  description: "",
  sportType: "FOOTBALL",
  address: "",
  pricePerHour: "",
  slotDurationMinutes: 60,
  openingTime: "08:00",
  closingTime: "22:00",
  amenities: "",
  location: {
    latitude: null,
    longitude: null,
  },
};

const CourtForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialForm);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCourt, setLoadingCourt] = useState(isEditMode);
  const [error, setError] = useState("");

  // Tạo ảnh xem trước cho những file mới được chọn
  useEffect(() => {
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));

    setSelectedPreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Tải dữ liệu sân khi chỉnh sửa
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
          pricePerHour: court.pricePerHour ?? "",
          slotDurationMinutes: court.slotDurationMinutes || 60,
          openingTime: court.openingTime || "08:00",
          closingTime: court.closingTime || "22:00",
          amenities: court.amenities?.join(", ") || "",
          location: {
            latitude: court.location?.latitude ?? null,
            longitude: court.location?.longitude ?? null,
          },
        });

        setExistingImages(court.images || []);
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

  // Chọn ảnh từ máy tính
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    // Cho phép chọn lại cùng một file sau khi bỏ chọn
    event.target.value = "";

    if (existingImages.length + files.length > MAX_IMAGES) {
      setError(`Tổng số ảnh của sân không được vượt quá ${MAX_IMAGES} ảnh.`);
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      setError("Vui lòng chỉ chọn file hình ảnh.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      setError("Mỗi ảnh phải có dung lượng tối đa 5 MB.");
      return;
    }

    setError("");
    setSelectedFiles(files);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

    setError("");
  };

  const removeSelectedImage = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      let uploadedImageUrls = [];

      // Chỉ upload khi có ảnh mới được chọn
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadCourtImages(selectedFiles);

        if (
          !uploadResult.success ||
          !Array.isArray(uploadResult.data?.images)
        ) {
          throw new Error("Không nhận được URL ảnh từ máy chủ.");
        }

        uploadedImageUrls = uploadResult.data.images;
      }

      const courtData = {
        ...formData,
        pricePerHour: Number(formData.pricePerHour),
        slotDurationMinutes: Number(formData.slotDurationMinutes),

        // Giữ ảnh cũ và thêm URL ảnh mới từ Cloudinary
        images: [...existingImages, ...uploadedImageUrls],

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

      setError(
        error.response?.data?.message ||
          error.message ||
          "Không thể lưu thông tin sân",
      );
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
            <label>Ảnh sân</label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={loading}
            />

            <small>
              Chọn tối đa {MAX_IMAGES} ảnh cho mỗi sân. Hỗ trợ JPG, PNG, WEBP;
              tối đa 5 MB mỗi ảnh.
            </small>
          </div>

          {(existingImages.length > 0 || selectedFiles.length > 0) && (
            <div className="court-image-preview-grid">
              {existingImages.map((url, index) => (
                <div className="court-image-preview" key={url + index}>
                  <img src={url} alt={`Ảnh sân ${index + 1}`} />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    disabled={loading}
                    aria-label={`Xóa ảnh sân ${index + 1}`}
                  >
                    Xóa ảnh
                  </button>

                  <small>Ảnh đã lưu</small>
                </div>
              ))}

              {selectedPreviews.map((url, index) => (
                <div
                  className="court-image-preview"
                  key={`${selectedFiles[index]?.name}-${index}`}
                >
                  <img src={url} alt={`Ảnh mới ${index + 1}`} />

                  <button
                    type="button"
                    onClick={() => removeSelectedImage(index)}
                    disabled={loading}
                    aria-label={`Bỏ ảnh mới ${index + 1}`}
                  >
                    Bỏ chọn
                  </button>

                  <small>Ảnh mới, chưa upload</small>
                </div>
              ))}
            </div>
          )}

          <small>
            Đã chọn {existingImages.length + selectedFiles.length}/{MAX_IMAGES}{" "}
            ảnh.
          </small>

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

        <div className="form-section">
          <div className="form-section-title">
            <span>VỊ TRÍ SÂN</span>
            <h3>Chọn vị trí trên bản đồ</h3>
            <p>
              Click vào vị trí chính xác của sân để người chơi dễ tìm đường.
            </p>
          </div>

          <LocationPicker
            value={formData.location}
            onChange={(location) =>
              setFormData((prev) => ({
                ...prev,
                location,
              }))
            }
          />

          {formData.location.latitude !== null &&
            formData.location.longitude !== null && (
              <div className="coordinates-preview">
                <span>Latitude: {formData.location.latitude.toFixed(6)}</span>
                <span>Longitude: {formData.location.longitude.toFixed(6)}</span>
              </div>
            )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="form-cancel-button"
            onClick={() => navigate("/owner/courts")}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="owner-primary-button"
            disabled={loading}
          >
            {loading
              ? selectedFiles.length > 0
                ? "Đang upload ảnh và lưu..."
                : "Đang lưu..."
              : isEditMode
                ? "Lưu thay đổi"
                : "Tạo sân"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourtForm;
