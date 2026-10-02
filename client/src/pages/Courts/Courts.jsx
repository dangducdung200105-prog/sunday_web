import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourts } from "../../services/courtService";
import CourtCard from "../../components/court/CourtCard";
import "./Courts.css";

const sportOptions = [
  { value: "", label: "All sports" },
  { value: "FOOTBALL", label: "Football" },
  { value: "BADMINTON", label: "Badminton" },
  { value: "TENNIS", label: "Tennis" },
  { value: "BASKETBALL", label: "Basketball" },
  { value: "VOLLEYBALL", label: "Volleyball" },
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
          <span className="eyebrow">FIND YOUR GAME</span>

          <h1>Find the perfect court.</h1>

          <p>
            Explore available sports courts and book your next game with SUNDAY.
          </p>

          {/* Search */}

          <div className="court-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search by court name, location or sport..."
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
                <h3>Filters</h3>

                {(sportType || maxPrice || search) && (
                  <button onClick={handleClearFilters}>Clear</button>
                )}
              </div>

              {/* Sport */}

              <div className="filter-group">
                <label>Sport</label>

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
                <label>Maximum price / hour</label>

                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any price</option>

                  <option value="100000">Under 100,000₫</option>

                  <option value="150000">Under 150,000₫</option>

                  <option value="200000">Under 200,000₫</option>

                  <option value="300000">Under 300,000₫</option>
                </select>
              </div>
            </aside>

            {/* ================= RESULTS ================= */}

            <div className="courts-results">
              <div className="results-toolbar">
                <div>
                  <strong>{filteredCourts.length}</strong> courts found
                </div>

                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Recommended</option>

                  <option value="price-low">Price: Low to High</option>

                  <option value="price-high">Price: High to Low</option>

                  <option value="name">Name</option>
                </select>
              </div>

              {/* Loading */}

              {loading && (
                <div className="courts-loading">
                  <div className="loading-spinner"></div>

                  <p>Finding courts...</p>
                </div>
              )}

              {/* Error */}

              {!loading && error && (
                <div className="courts-error">
                  <div>⚠️</div>

                  <h3>Something went wrong</h3>

                  <p>{error}</p>

                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty */}

              {!loading && !error && filteredCourts.length === 0 && (
                <div className="courts-empty">
                  <div className="empty-icon">🏟️</div>

                  <h3>No courts found</h3>

                  <p>Try changing your search or filters.</p>

                  <button
                    className="btn btn-secondary"
                    onClick={handleClearFilters}
                  >
                    Clear filters
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
