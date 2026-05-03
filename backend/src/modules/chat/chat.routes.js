const express = require("express");
const router = express.Router();

const {
  getOrCreateChat,
  getMessages,
} = require("./chat.controller");

const { protect } = require("../../middlewares/authMiddleware");

router.post("/", protect, getOrCreateChat);
router.get("/:chatId/messages", protect, getMessages);

module.exports = router;