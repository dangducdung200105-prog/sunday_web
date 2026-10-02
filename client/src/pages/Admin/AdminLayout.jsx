import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-title">Quản trị</p>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users">Người dùng</NavLink>

          <NavLink to="/admin/owners">Chủ sân</NavLink>

          <NavLink to="/admin/courts">Duyệt sân</NavLink>

          <NavLink to="/admin/bookings">Đơn đặt sân</NavLink>
        </nav>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
