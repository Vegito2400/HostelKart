const Chat = require("./chat.model");
const Message = require("./message.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("join_chat", ({ chatId }) => {
      socket.join(chatId);
    });

    // Send message
    socket.on("send_message", async ({ chatId, senderId, text }) => {
      const message = await Message.create({
        chatId,
        senderId,
        text,
      });

      io.to(chatId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};