const sportLabels = {
  FOOTBALL: "Bóng đá",
  BADMINTON: "Cầu lông",
  TENNIS: "Quần vợt",
  BASKETBALL: "Bóng rổ",
  VOLLEYBALL: "Bóng chuyền",
  OTHER: "Khác",
};

const bookingStatusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const paymentStatusLabels = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const roleLabels = {
  CUSTOMER: "Khách hàng",
  USER: "Người dùng",
  OWNER: "Chủ sân",
  ADMIN: "Quản trị viên",
};

const courtStatusLabels = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Tạm ngưng",
};

export const getSportLabel = (value) => sportLabels[value] || value || "Chưa cập nhật";
export const getBookingStatusLabel = (value) => bookingStatusLabels[value] || value;
export const getPaymentStatusLabel = (value) => paymentStatusLabels[value] || value;
export const getRoleLabel = (value) => roleLabels[value] || value;
export const getCourtStatusLabel = (value) => courtStatusLabels[value] || value;
