const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const qs = require("qs");
const { sortObject, createSecureHash } = require("../utils/vnpay");

const createPayment = async ({ bookingId, userId, method }) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === "CANCELLED") {
    const error = new Error("Cancelled booking cannot be paid");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status !== "PENDING") {
    const error = new Error("Only pending bookings can be paid");
    error.statusCode = 400;
    throw error;
  }

  if (booking.expiresAt && booking.expiresAt <= new Date()) {
    await Booking.findByIdAndUpdate(bookingId, { status: "CANCELLED" });
    const error = new Error("Booking payment window has expired");
    error.statusCode = 400;
    throw error;
  }

  if (booking.paymentStatus === "PAID") {
    const error = new Error("Booking has already been paid");
    error.statusCode = 400;
    throw error;
  }

  let payment = await Payment.findOne({
    booking: bookingId,
  });

  if (!payment) {
    payment = await Payment.create({
      booking: booking._id,
      user: userId,
      amount: booking.price,
      method,
      status: "PENDING",
    });
  }

  if (!payment.transactionRef || payment.status === "FAILED") {
    payment.status = "PENDING";
    payment.transactionId = null;
    payment.paidAt = null;
    payment.gatewayResponse = null;
    payment.transactionRef = `${payment._id}_${Date.now()}`;
    await payment.save();
  }

  return payment;
};

const createVnpayUrl = (payment) => {
  const requiredConfig = [
    "VNPAY_TMN_CODE",
    "VNPAY_PAYMENT_URL",
    "VNPAY_RETURN_URL",
    "VNPAY_HASH_SECRET",
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(`Missing VNPay configuration: ${missingConfig.join(", ")}`);
  }

  const now = new Date();
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_Amount: Math.round(payment.amount * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: payment.transactionRef,
    vnp_OrderInfo: `Thanh toan booking ${payment.booking}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
    vnp_CreateDate: formatVnpayDate(now),
    vnp_ExpireDate: formatVnpayDate(new Date(now.getTime() + 15 * 60 * 1000)),
    vnp_IpAddr: "127.0.0.1",
  };
  const sortedParams = sortObject(params);

  sortedParams.vnp_SecureHash = createSecureHash(sortedParams);

  return `${process.env.VNPAY_PAYMENT_URL}?${qs.stringify(sortedParams, {
    encode: false,
  })}`;
};

const formatVnpayDate = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  return ["year", "month", "day", "hour", "minute", "second"]
    .map(getPart)
    .join("");
};

module.exports = {
  createPayment,
  createVnpayUrl,
};
