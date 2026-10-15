const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  createProfile,
  updateMyProfile,
} = require("../controllers/playerProfileController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, getMyProfile);

router.post("/", authMiddleware, createProfile);

router.put("/me", authMiddleware, updateMyProfile);

module.exports = router;
