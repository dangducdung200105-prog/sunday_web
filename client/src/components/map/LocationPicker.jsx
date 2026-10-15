import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

const DEFAULT_POSITION = [21.0285, 105.8542];

const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function isValidCoordinate(latitude, longitude) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

// Tự di chuyển bản đồ khi tọa độ được cập nhật
function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && isValidCoordinate(position.latitude, position.longitude)) {
      map.flyTo([position.latitude, position.longitude], 16, {
        duration: 1,
      });
    }
  }, [map, position?.latitude, position?.longitude]);

  return null;
}

function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  if (!position || !isValidCoordinate(position.latitude, position.longitude)) {
    return null;
  }

  return (
    <Marker
      position={[position.latitude, position.longitude]}
      icon={defaultIcon}
    />
  );
}

function LocationPicker({ value, onChange }) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const hasValidPosition = isValidCoordinate(value?.latitude, value?.longitude);

  const center = hasValidPosition
    ? [value.latitude, value.longitude]
    : DEFAULT_POSITION;

  const handleLocateMe = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        onChange({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        });

        setLocating(false);
      },
      (geoError) => {
        if (geoError.code === 1) {
          setError(
            "Bạn chưa cấp quyền vị trí. Hãy cho phép truy cập vị trí trong trình duyệt.",
          );
        } else if (geoError.code === 2) {
          setError("Không xác định được vị trí. Hãy thử lại.");
        } else {
          setError("Định vị quá thời gian chờ. Hãy thử lại.");
        }

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <p style={{ margin: 0 }}>
          Chọn vị trí sân bằng cách chia sẻ vị trí hoặc click lên bản đồ.
        </p>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="owner-primary-button"
        >
          {locating ? "Đang định vị..." : "Chia sẻ vị trí hiện tại"}
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: "#c62828", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <div className="location-picker">
        <MapContainer
          center={center}
          zoom={hasValidPosition ? 16 : 13}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController position={value} />

          <LocationMarker position={value} onChange={onChange} />
        </MapContainer>
      </div>

      {hasValidPosition ? (
        <p style={{ marginTop: 10, fontSize: 13 }}>
          Vị trí đã chọn: {value.latitude.toFixed(6)},{" "}
          {value.longitude.toFixed(6)}
        </p>
      ) : (
        <p style={{ marginTop: 10, fontSize: 13 }}>Chưa chọn vị trí sân.</p>
      )}
    </div>
  );
}

export default LocationPicker;
