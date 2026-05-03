const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis();

const notificationQueue = new Queue("notifications", {
  connection,
});

module.exports = { notificationQueue };