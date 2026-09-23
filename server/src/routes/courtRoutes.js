const express = require("express");

const {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt,
} = require("../controllers/courtController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getCourts);
router.get("/:id", getCourtById);

// OWNER
router.post("/", authMiddleware, roleMiddleware("OWNER"), createCourt);

router.put("/:id", authMiddleware, roleMiddleware("OWNER"), updateCourt);

router.delete("/:id", authMiddleware, roleMiddleware("OWNER"), deleteCourt);

module.exports = router;
