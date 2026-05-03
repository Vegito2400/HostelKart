const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("./modules/chat/chat.socket")(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});