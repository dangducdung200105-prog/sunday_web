import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Courts from "../pages/Courts/Courts";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CourtDetail from "../pages/CourtDetail/CourtDetail";
import MyBookings from "../pages/MyBookings/MyBookings";
import ProtectedRoute from "./ProtectedRoute";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import MyCourts from "../pages/Owner/MyCourts";
import CourtForm from "../pages/Owner/CourtForm";
import OwnerBookings from "../pages/Owner/OwnerBookings";
import PaymentResult from "../pages/Payment/PaymentResult";
import BookingDetail from "../pages/Booking/BookingDetail";
import OwnerRoute from "./OwnerRoute";
// import AdminLayout from "../pages/Admin/AdminLayout";
// import AdminDashboard from "../pages/Admin/AdminDashboard";
// import AdminUsers from "../pages/Admin/AdminUsers";
// import AdminOwners from "../pages/Admin/AdminOwners";
// import AdminCourts from "../pages/Admin/AdminCourts";
// import AdminBookings from "../pages/Admin/AdminBookings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courts" element={<Courts />} />
      <Route path="/courts/:id" element={<CourtDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/my-bookings" element={<MyBookings />} />
      </Route>

      <Route element={<OwnerRoute />}>
        <Route path="/owner" element={<OwnerDashboard />} />

        <Route path="/owner/courts" element={<MyCourts />} />

        <Route path="/owner/courts/create" element={<CourtForm />} />

        <Route path="/owner/courts/:id/edit" element={<CourtForm />} />

        <Route path="/owner/bookings" element={<OwnerBookings />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
      </Route>

      <Route path="/payment-result" element={<PaymentResult />} />
      {/* <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="admin/owners" element={<AdminOwners />} />
          <Route path="courts" element={<AdminCourts />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Route> */}
    </Routes>
  );
};

export default AppRoutes;
