const { createPayment, createVnpayUrl } = require("../services/paymentService");
const { processVnpayResult } = require("../services/vnpayService");
const createPaymentRequest = async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({
        success: false,
        message: "bookingId and method are required",
      });
    }

    if (method !== "VNPAY") {
      return res.status(400).json({
        success: false,
        message: "Currently only VNPAY is supported",
      });
    }

    const payment = await createPayment({
      bookingId,
      userId: req.user._id,
      method,
    });

    const paymentUrl = await createVnpayUrl(payment);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment: {
          id: payment._id,
          booking: payment.booking,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
        },

        paymentUrl,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
      console.error("Unable to create VNPay payment:", error);
    }

    res.status(statusCode).json({
      success: false,
      message:
        statusCode >= 500
          ? "Unable to create payment. Please try again later."
          : error.message,
    });
  }
};
const { verifySecureHash } = require("../utils/vnpay");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const vnpayIPN = async (req, res) => {
  try {
    const params = {
      ...req.query,
    };

    const receivedHash = params.vnp_SecureHash;

    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const isValid = verifySecureHash(params, receivedHash);

    if (!isValid) {
      return res.json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    const result = await processVnpayResult(params);

    return res.json({
      RspCode: result.code,
      Message: result.message,
    });
  } catch (error) {
    console.error("VNPAY IPN error:", error);

    return res.json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
};
const vnpayReturn = async (req, res) => {
  try {
    const params = {
      ...req.query,
    };

    const receivedHash = params.vnp_SecureHash;

    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const isValid = verifySecureHash(params, receivedHash);

    if (!isValid) {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-result?status=invalid`,
      );
    }

    const transactionRef = params.vnp_TxnRef;

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

      payment.transactionRef = payment._id.toString();

      await payment.save();
    } else if (payment.status === "FAILED") {
      payment.status = "PENDING";
      payment.transactionId = null;
      payment.paidAt = null;
      payment.gatewayResponse = null;

      // tạo transaction reference mới
      payment.transactionRef = `${payment._id}_${Date.now()}`;

      await payment.save();
    }

    const amount = Number(params.vnp_Amount) / 100;

    if (amount !== payment.amount) {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-result?status=invalid`,
      );
    }

    // Chỉ đọc trạng thái hiện tại
    if (payment.status === "PAID") {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-result?status=success`,
      );
    }

    if (payment.status === "FAILED") {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-result?status=failed`,
      );
    }

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-result?status=pending`,
    );
  } catch (error) {
    console.error(error);

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-result?status=error`,
    );
  }
};
module.exports = {
  createPaymentRequest,
  vnpayReturn,
  vnpayIPN,
};
