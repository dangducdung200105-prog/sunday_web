const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const processVnpayResult = async (params) => {
  const transactionRef = params.vnp_TxnRef;

  if (!transactionRef) {
    return {
      success: false,
      code: "01",
      message: "Missing transaction reference",
    };
  }

  const payment = await Payment.findOne({
    transactionRef,
  });

  if (!payment) {
    return {
      success: false,
      code: "01",
      message: "Payment not found",
    };
  }

  const amount = Number(params.vnp_Amount) / 100;

  if (amount !== payment.amount) {
    return {
      success: false,
      code: "04",
      message: "Invalid amount",
    };
  }

  // Idempotency
  if (payment.status === "PAID") {
    return {
      success: true,
      code: "00",
      message: "Payment already confirmed",
      payment,
    };
  }

  const isSuccess =
    params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";

  if (isSuccess) {
    payment.status = "PAID";
    payment.transactionId = params.vnp_TransactionNo || null;
    payment.paidAt = new Date();
    payment.gatewayResponse = params;

    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      expiresAt: null,
    });

    return {
      success: true,
      code: "00",
      message: "Confirm Success",
      payment,
    };
  }

  payment.status = "FAILED";
  payment.gatewayResponse = params;

  await payment.save();

  return {
    success: true,
    code: "00",
    message: "Payment failed but request processed",
    payment,
  };
};

module.exports = {
  processVnpayResult,
};
