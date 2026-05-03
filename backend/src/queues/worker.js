const { Worker } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis();

const worker = new Worker(
  "notifications",
  async (job) => {
    console.log("Processing job:", job.name);

    if (job.name === "send_notification") {
      const { userId, message } = job.data;

      // Simulate notification (later replace with email/socket)
      console.log(`Notify User ${userId}: ${message}`);
    }

    if (job.name === "cleanup_offers") {
      console.log("Cleaning expired offers...");
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});