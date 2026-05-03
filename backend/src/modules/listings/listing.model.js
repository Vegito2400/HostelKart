const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      text: true,
    },
    description: {
      type: String,
      required: true,
      text: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good",
    },
    images: [String],
    status: {
      type: String,
      enum: ["active", "reserved", "sold"],
      default: "active",
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Listing", listingSchema);
