const express = require("express");
const router = express.Router();
const {
  create,
  getMyOffers,
  respond,
} = require("./offer.controller");

const { protect } = require("../../middlewares/authMiddleware");

router.post("/", protect, create);
router.get("/", protect, getMyOffers);
router.patch("/:id/respond", protect, respond);

module.exports = router;