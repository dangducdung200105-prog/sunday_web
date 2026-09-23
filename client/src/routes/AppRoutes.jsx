import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Courts from "../pages/Courts/Courts";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CourtDetail from "../pages/CourtDetail/CourtDetail";
import MyBookings from "../pages/MyBookings/MyBookings";
import ProtectedRoute from "./ProtectedRoute";

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
    </Routes>
  );
};

export default AppRoutes;
