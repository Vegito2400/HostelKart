const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("./listing.controller");

const { protect } = require("../../middlewares/authMiddleware");

router.get("/", getAll);
router.get("/:id", getOne);

router.post("/", protect, create);
router.patch("/:id", protect, update);
router.delete("/:id", protect, remove);

module.exports = router;