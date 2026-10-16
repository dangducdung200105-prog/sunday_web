const { createPayment, createVnpayUrl } = require("../services/paymentService");
const { processVnpayResult } = require("../services/vnpayService");
const { verifySecureHash } = require("../utils/vnpay");

const createPaymentRequest = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    if (!bookingId || !method) {
      return res.status(400).json({ success: false, message: "bookingId and method are required" });
    }
    if (method !== "VNPAY") {
      return res.status(400).json({ success: false, message: "Currently only VNPAY is supported" });
    }

    const payment = await createPayment({ bookingId, userId: req.user._id, method });
    const paymentUrl = createVnpayUrl(payment, req.ip);
    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment: { id: payment._id, booking: payment.booking, amount: payment.amount, method: payment.method, status: payment.status },
        paymentUrl,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode >= 500) console.error("Unable to create VNPay payment:", error);
    return res.status(statusCode).json({
      success: false,
      message: statusCode >= 500 ? "Unable to create payment. Please try again later." : error.message,
    });
  }
};

const getVerifiedParams = (query) => {
  const params = { ...query };
  const receivedHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;
  return verifySecureHash(params, receivedHash) ? params : null;
};

const vnpayIPN = async (req, res) => {
  try {
    const params = getVerifiedParams(req.query);
    if (!params) return res.json({ RspCode: "97", Message: "Invalid signature" });
    const result = await processVnpayResult(params);
    return res.json({ RspCode: result.code, Message: result.message });
  } catch (error) {
    console.error("VNPAY IPN error:", error);
    return res.json({ RspCode: "99", Message: "Unknown error" });
  }
};

const vnpayReturn = async (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  try {
    const params = getVerifiedParams(req.query);
    if (!params) return res.redirect(`${clientUrl}/payment-result?status=invalid`);

    // VNPay calls the browser return and IPN independently; this is safe to repeat.
    const result = await processVnpayResult(params);
    const status = result.code === "04" || result.code === "01"
      ? "invalid"
      : result.payment?.status === "PAID"
        ? "success"
        : result.payment?.status === "FAILED"
          ? "failed"
          : "pending";
    return res.redirect(`${clientUrl}/payment-result?status=${status}`);
  } catch (error) {
    console.error("VNPAY return error:", error);
    return res.redirect(`${clientUrl}/payment-result?status=error`);
  }
};

module.exports = { createPaymentRequest, vnpayReturn, vnpayIPN };
