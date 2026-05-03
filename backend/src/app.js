const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const errorHandler = require("./middlewares/errorMiddleware");
const listingRoutes = require("./modules/listings/listing.routes.js");
const offerRoutes = require("./modules/offers/offer.routes");
const chatRoutes = require("./modules/chat/chat.routes.js");
const app = express();

app.use(cors());
app.use(express.json({ limit: "6mb" }));
app.use(morgan("dev"));
app.use("/api/auth",authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/listing",listingRoutes);
app.use("/api/offers",offerRoutes);
app.use("/api/chat",chatRoutes);
app.use(errorHandler);

module.exports = app;
