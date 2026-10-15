const express = require("express");

const router = express.Router();

const {
  getPlayers,
  swipePlayer,
  getMyMatches,
  unmatch,
} = require("../controllers/matchController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/players", authMiddleware, getPlayers);

router.post("/swipe", authMiddleware, swipePlayer);

router.get("/", authMiddleware, getMyMatches);

router.delete("/:matchId", authMiddleware, unmatch);

module.exports = router;
