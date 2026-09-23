const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Kiểm tra user đã đăng nhập chưa
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Kiểm tra role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Cho phép đi tiếp
    next();
  };
};

module.exports = roleMiddleware;
