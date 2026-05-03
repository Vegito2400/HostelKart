const Chat = require("./chat.model");
const Message = require("./message.model");

const getOrCreateChat = async (req, res, next) => {
  try {
    const { listingId, otherUserId } = req.body;

    let chat = await Chat.findOne({
      listingId,
      participants: { $all: [req.user._id, otherUserId] },
    });

    if (!chat) {
      chat = await Chat.create({
        listingId,
        participants: [req.user._id, otherUserId],
      });
    }

    res.json(chat);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrCreateChat, getMessages };