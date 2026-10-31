import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPlayerProfile, savePlayerProfile } from "../../services/matchService";
import { useAuth } from "../../context/AuthContext";
import "./PlayerProfile.css";

const sportOptions = ["FOOTBALL", "BADMINTON", "TENNIS", "BASKETBALL", "VOLLEYBALL", "OTHER"];
const sportNames = { FOOTBALL: "Bóng đá", BADMINTON: "Cầu lông", TENNIS: "Quần vợt", BASKETBALL: "Bóng rổ", VOLLEYBALL: "Bóng chuyền", OTHER: "Khác" };
const blank = { displayName: "", gender: "PREFER_NOT_TO_SAY", bio: "", ranking: "", interestsText: "", district: "", city: "", preferredTimesText: "", sports: [], isLookingForPlayers: true };

function PlayerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState(blank);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyPlayerProfile().then(({ data }) => {
      if (!active || !data) return;
      setExists(true);
      setForm({
        ...blank, ...data,
        displayName: data.displayName || data.user?.name || user?.name || "",
        ranking: data.ranking || "",
        district: data.location?.district || "", city: data.location?.city || "",
        interestsText: (data.interests || []).join(", "),
        preferredTimesText: (data.preferredTimes || []).join(", "),
        sports: data.sports || [],
      });
    }).catch((err) => {
      if (err.response?.status !== 404) setError(err.response?.data?.message || "Không thể tải hồ sơ.");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user?.name]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleSport = (sportType) => set("sports", form.sports.some((sport) => sport.sportType === sportType)
    ? form.sports.filter((sport) => sport.sportType !== sportType)
    : [...form.sports, { sportType, skillLevel: "BEGINNER" }]);
  const setSkill = (sportType, skillLevel) => set("sports", form.sports.map((sport) => sport.sportType === sportType ? { ...sport, skillLevel } : sport));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const payload = {
        displayName: form.displayName.trim(), gender: form.gender, bio: form.bio.trim(), ranking: form.ranking.trim(),
        interests: form.interestsText.split(",").map((item) => item.trim()).filter(Boolean),
        sports: form.sports,
        location: { district: form.district.trim(), city: form.city.trim() || "Ha Noi" },
        preferredTimes: form.preferredTimesText.split(",").map((item) => item.trim()).filter(Boolean),
        isLookingForPlayers: form.isLookingForPlayers,
      };
      await savePlayerProfile(payload, exists);
      setExists(true); setNotice("Hồ sơ đã được lưu. Thông tin của bạn sẽ xuất hiện trong mục Tìm bạn chơi.");
    } catch (err) { setError(err.response?.data?.message || "Không thể lưu hồ sơ."); }
    finally { setSaving(false); }
  };

  if (loading) return <main className="profile-page"><div className="profile-shell">Đang tải hồ sơ…</div></main>;

  return <main className="profile-page"><div className="profile-shell">
    <header className="profile-heading"><div><span className="profile-eyebrow">CỘNG ĐỒNG SUNDAY</span><h1>Hồ sơ người chơi</h1><p>Chia sẻ môn thể thao, trình độ và lịch chơi để tìm đồng đội phù hợp.</p></div><Link to="/match">Xem mục tìm bạn chơi →</Link></header>
    {notice && <div className="profile-notice">{notice}</div>}{error && <div className="profile-error">{error}</div>}
    <form className="profile-form" onSubmit={submit}>
      <section className="profile-section"><h2>Thông tin cá nhân</h2><div className="profile-fields">
        <label>Tên hiển thị<input required maxLength="80" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder={user?.name || "Tên của bạn"} /></label>
        <label>Giới tính<select value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="PREFER_NOT_TO_SAY">Không muốn chia sẻ</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></label>
        <label>Khu vực / quận<input maxLength="100" value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Ví dụ: Cầu Giấy" /></label>
        <label>Thành phố<input maxLength="100" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Hà Nội" /></label>
        <label>Ranking / trình xếp hạng<input maxLength="60" value={form.ranking} onChange={(e) => set("ranking", e.target.value)} placeholder="Ví dụ: Trung bình khá, 1200 Elo…" /></label>
        <label className="profile-wide">Mô tả<textarea rows="4" maxLength="300" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Giới thiệu về phong cách chơi và đồng đội bạn muốn tìm…" /><small>{form.bio.length}/300</small></label>
      </div></section>
      <section className="profile-section"><h2>Bộ môn và trình độ</h2><div className="profile-sports">{sportOptions.map((sport) => { const selected = form.sports.find((item) => item.sportType === sport); return <div className={`profile-sport ${selected ? "selected" : ""}`} key={sport}><label><input type="checkbox" checked={!!selected} onChange={() => toggleSport(sport)} />{sportNames[sport]}</label>{selected && <select aria-label={`Trình độ ${sportNames[sport]}`} value={selected.skillLevel} onChange={(e) => setSkill(sport, e.target.value)}><option value="BEGINNER">Cơ bản</option><option value="INTERMEDIATE">Trung bình</option><option value="ADVANCED">Nâng cao</option></select>}</div>; })}</div></section>
      <section className="profile-section"><h2>Lịch chơi và sở thích</h2><div className="profile-fields">
        <label>Thời gian thường chơi<input value={form.preferredTimesText} onChange={(e) => set("preferredTimesText", e.target.value)} placeholder="Ví dụ: Tối ngày thường, sáng cuối tuần" /><small>Ngăn cách các khung giờ bằng dấu phẩy.</small></label>
        <label>Sở thích<input value={form.interestsText} onChange={(e) => set("interestsText", e.target.value)} placeholder="Ví dụ: đánh đôi, giao lưu, thi đấu" /><small>Ngăn cách các sở thích bằng dấu phẩy.</small></label>
      </div><label className="profile-availability"><input type="checkbox" checked={form.isLookingForPlayers} onChange={(e) => set("isLookingForPlayers", e.target.checked)} /> Hiển thị hồ sơ trong mục tìm bạn chơi</label></section>
      <footer className="profile-submit"><span>{exists ? "Hồ sơ đã tạo — bạn có thể cập nhật bất cứ lúc nào." : "Hoàn thành hồ sơ để xuất hiện trong danh sách tìm bạn chơi."}</span><button disabled={saving}>{saving ? "Đang lưu…" : "Lưu hồ sơ"}</button></footer>
    </form>
  </div></main>;
}

export default PlayerProfile;
