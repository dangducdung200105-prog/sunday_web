import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourts } from "../../services/courtService";
import CourtCard from "../../components/court/CourtCard";
import "./Courts.css";

const sportOptions = [
  { value: "", label: "Tất cả môn thể thao" },
  { value: "FOOTBALL", label: "Bóng đá" },
  { value: "BADMINTON", label: "Cầu lông" },
  { value: "TENNIS", label: "Quần vợt" },
  { value: "BASKETBALL", label: "Bóng rổ" },
  { value: "VOLLEYBALL", label: "Bóng chuyền" },
];

const Courts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sportType, setSportType] = useState(
    searchParams.get("sportType") || "",
  );

  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getCourts();
        console.log("GET COURTS RESULT:", result);
        console.log("COURTS:", result.data?.courts);
        console.log("IS ARRAY:", Array.isArray(result.data?.courts));
        console.log("GET COURTS RESULT:", result);

        setCourts(result.data?.courts || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Không thể tải danh sách sân.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const filteredCourts = useMemo(() => {
    let result = [...courts];

    /* Search */
    if (search.trim()) {
      const keyword = search.toLowerCase().trim();

      result = result.filter((court) => {
        return (
          court.name?.toLowerCase().includes(keyword) ||
          court.address?.toLowerCase().includes(keyword) ||
          court.sportType?.toLowerCase().includes(keyword)
        );
      });
    }

    /* Sport */
    if (sportType) {
      result = result.filter((court) => court.sportType === sportType);
    }

    /* Price */
    if (maxPrice) {
      result = result.filter(
        (court) => Number(court.pricePerHour) <= Number(maxPrice),
      );
    }

    /* Sort */
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.pricePerHour) - Number(b.pricePerHour));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.pricePerHour) - Number(a.pricePerHour));
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [courts, search, sportType, maxPrice, sortBy]);
  console.log("STATE COURTS:", courts);
  console.log("FILTERED COURTS:", filteredCourts);
  console.log("LOADING:", loading);
  console.log("ERROR:", error);
  const handleSportChange = (value) => {
    setSportType(value);

    if (value) {
      setSearchParams({ sportType: value });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSportType("");
    setMaxPrice("");
    setSortBy("default");
    setSearchParams({});
  };

  return (
    <main className="courts-page">
      {/* ================= HEADER ================= */}

      <section className="courts-header">
        <div className="container">
          <span className="eyebrow">TÌM SÂN PHÙ HỢP</span>

          <h1>Tìm sân phù hợp với bạn.</h1>

          <p>
            Khám phá các sân thể thao và đặt lịch chơi cùng SUNDAY.
          </p>

          {/* Search */}

          <div className="court-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Tìm theo tên sân, khu vực hoặc môn thể thao..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="courts-content">
        <div className="container">
          <div className="courts-layout">
            {/* ================= FILTER ================= */}

            <aside className="filters">
              <div className="filter-header">
                <h3>Bộ lọc</h3>

                {(sportType || maxPrice || search) && (
                  <button onClick={handleClearFilters}>Xóa bộ lọc</button>
                )}
              </div>

              {/* Sport */}

              <div className="filter-group">
                <label>Môn thể thao</label>

                <div className="sport-filter-list">
                  {sportOptions.map((sport) => (
                    <button
                      key={sport.value}
                      className={
                        sportType === sport.value
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() => handleSportChange(sport.value)}
                    >
                      {sport.label}

                      {sportType === sport.value && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}

              <div className="filter-group">
                <label>Giá tối đa / giờ</label>

                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Mọi mức giá</option>

                  <option value="100000">Dưới 100.000đ</option>

                  <option value="150000">Dưới 150.000đ</option>

                  <option value="200000">Dưới 200.000đ</option>

                  <option value="300000">Dưới 300.000đ</option>
                </select>
              </div>
            </aside>

            {/* ================= RESULTS ================= */}

            <div className="courts-results">
              <div className="results-toolbar">
                <div>
                  <strong>{filteredCourts.length}</strong> sân được tìm thấy
                </div>

                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Đề xuất</option>

                  <option value="price-low">Giá: thấp đến cao</option>

                  <option value="price-high">Giá: cao đến thấp</option>

                  <option value="name">Tên sân</option>
                </select>
              </div>

              {/* Loading */}

              {loading && (
                <div className="courts-loading">
                  <div className="loading-spinner"></div>

                  <p>Đang tìm sân...</p>
                </div>
              )}

              {/* Error */}

              {!loading && error && (
                <div className="courts-error">
                  <div>⚠️</div>

                  <h3>Đã xảy ra lỗi</h3>

                  <p>{error}</p>

                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Empty */}

              {!loading && !error && filteredCourts.length === 0 && (
                <div className="courts-empty">
                  <div className="empty-icon">🏟️</div>

                  <h3>Không tìm thấy sân</h3>

                  <p>Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>

                  <button
                    className="btn btn-secondary"
                    onClick={handleClearFilters}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Grid */}

              {!loading && !error && filteredCourts.length > 0 && (
                <div className="courts-grid">
                  {filteredCourts.map((court) => {
                    console.log("RENDERING COURT:", court);
                    return <CourtCard key={court._id} court={court} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Courts;
