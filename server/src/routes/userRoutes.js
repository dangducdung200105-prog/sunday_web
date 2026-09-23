const express = require("express");

const { createUser, getOwnerData } = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", createUser);

router.get(
  "/owner-test",
  authMiddleware,
  roleMiddleware("OWNER"),
  getOwnerData,
);

module.exports = router;
