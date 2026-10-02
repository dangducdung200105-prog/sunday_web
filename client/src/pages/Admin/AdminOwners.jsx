import { useEffect, useState } from "react";

import { getAllOwners } from "../../services/adminService";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const result = await getAllOwners();

        setOwners(result.data.owners);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Không thể tải chủ sân");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Quản lý chủ sân</h1>

        <p>Danh sách tài khoản có role OWNER và số sân đang sở hữu.</p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Số sân</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {owners.length === 0 ? (
              <tr>
                <td colSpan={5}>Chưa có chủ sân nào.</td>
              </tr>
            ) : (
              owners.map((owner) => (
                <tr key={owner._id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phone || "-"}</td>
                  <td>{owner.courtCount}</td>
                  <td>
                    <span
                      className={`admin-badge ${owner.isActive ? "active" : "inactive"}`}
                    >
                      {owner.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOwners;
