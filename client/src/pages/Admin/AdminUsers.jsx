import { useEffect, useState } from "react";

import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
} from "../../services/adminService";

const ROLES = ["USER", "OWNER", "ADMIN"];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};

      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;

      const result = await getAllUsers(params);

      setUsers(result.data.users);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Không thể tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    fetchUsers();
  };

  const handleToggleStatus = async (targetUser) => {
    try {
      await updateUserStatus(targetUser._id, !targetUser.isActive);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? { ...u, isActive: !u.isActive } : u,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleRoleChange = async (targetUser, newRole) => {
    if (newRole === targetUser.role) return;

    const confirmed = window.confirm(
      `Đổi role của ${targetUser.name} thành ${newRole}?`,
    );

    if (!confirmed) return;

    try {
      await updateUserRole(targetUser._id, newRole);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? { ...u, role: newRole } : u,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Không thể cập nhật role");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Quản lý người dùng</h1>

        <p>Danh sách toàn bộ tài khoản trong hệ thống.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <button
            className={roleFilter === "" ? "active" : ""}
            onClick={() => setRoleFilter("")}
          >
            Tất cả
          </button>

          {ROLES.map((role) => (
            <button
              key={role}
              className={roleFilter === role ? "active" : ""}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <form className="admin-toolbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Tìm</button>
        </form>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Role</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6}>Không tìm thấy người dùng nào.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "-"}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${u.isActive ? "active" : "inactive"}`}
                      >
                        {u.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleToggleStatus(u)}>
                        {u.isActive ? "Khóa" : "Mở khóa"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
