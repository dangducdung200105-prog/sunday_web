const express = require("express");

const {
  createPaymentRequest,
  vnpayReturn,
  vnpayIPN,
} = require("../controllers/paymentController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPaymentRequest);

router.get("/vnpay/return", vnpayReturn);

router.get("/vnpay/ipn", vnpayIPN);
module.exports = router;
