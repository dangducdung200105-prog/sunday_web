const express = require("express");

const {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt,
  getMyCourts,
} = require("../controllers/courtController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const courtImageUpload = require("../middlewares/courtImageUpload");
const { uploadCourtImages } = require("../controllers/courtImageController");

const router = express.Router();

// Public
router.get("/", getCourts);

router.get("/my-courts", authMiddleware, roleMiddleware("OWNER"), getMyCourts);

router.get("/:id", getCourtById);

// OWNER
router.post("/", authMiddleware, roleMiddleware("OWNER"), createCourt);

router.put("/:id", authMiddleware, roleMiddleware("OWNER"), updateCourt);

router.delete("/:id", authMiddleware, roleMiddleware("OWNER"), deleteCourt);

// OWNER - Upload court images
router.post(
  "/upload-images",
  authMiddleware,
  roleMiddleware("OWNER"),
  courtImageUpload.array("images", 5),
  uploadCourtImages,
);

module.exports = router;
