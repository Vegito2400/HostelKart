const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  updateStatus,
} = require("./report.controller");

const { protect, adminOnly } = require("../../middlewares/authMiddleware");

// You can later add admin middleware
router.post("/", protect, create);

// Admin routes
router.get("/", protect, adminOnly, getAll);
router.patch("/:id", protect, adminOnly, updateStatus);

module.exports = router;
