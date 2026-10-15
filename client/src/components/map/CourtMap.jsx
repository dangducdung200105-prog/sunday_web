import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./CourtMap.css";

const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CourtMap({ latitude, longitude, courtName }) {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined
  ) {
    return (
      <div className="court-map-empty">
        <span>📍</span>

        <p>Sân chưa cập nhật vị trí trên bản đồ.</p>
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="court-map">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={defaultIcon}>
          <Popup>
            <strong>{courtName}</strong>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default CourtMap;
