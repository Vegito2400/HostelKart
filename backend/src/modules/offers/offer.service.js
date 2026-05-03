const Offer = require("./offer.model");
const Listing = require("../listings/listing.model");
const { clearListingsCache } = require("../listings/listing.service");

const createOffer = async ({ listingId, offeredPrice }, buyerId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) throw new Error("Listing not found");

  if (listing.status !== "active") {
    throw new Error("Listing not available");
  }

  if (listing.sellerId.toString() === buyerId.toString()) {
    throw new Error("You cannot offer on your own listing");
  }

  const offer = await Offer.create({
    listingId,
    buyerId,
    sellerId: listing.sellerId,
    offeredPrice,
  });

  return await Offer.findById(offer._id)
    .populate("listingId")
    .populate("buyerId", "name email role")
    .populate("sellerId", "name email role");
};

const getUserOffers = async (userId) => {
  return await Offer.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
  })
    .populate("listingId")
    .populate("buyerId", "name email role")
    .populate("sellerId", "name email role")
    .sort({ createdAt: -1 });
};

const respondToOffer = async (offerId, sellerId, action) => {
  const offer = await Offer.findById(offerId);

  if (!offer) throw new Error("Offer not found");

  if (offer.sellerId.toString() !== sellerId.toString()) {
    throw new Error("Not authorized");
  }

  if (offer.status !== "pending") {
    throw new Error("Offer already processed");
  }

  if (action === "reject") {
    offer.status = "rejected";
    await offer.save();
    return await Offer.findById(offer._id)
      .populate("listingId")
      .populate("buyerId", "name email role")
      .populate("sellerId", "name email role");
  }

  if (action === "accept") {
    await clearListingsCache();
    const listing = await Listing.findOneAndUpdate(
      {
        _id: offer.listingId,
        status: "active",
      },
      {
        status: "reserved",
      },
      { new: true }
    );

    if (!listing) {
      throw new Error("Listing already reserved by another offer");
    }

    offer.status = "accepted";
    await offer.save();

    await Offer.updateMany(
      {
        listingId: offer.listingId,
        _id: { $ne: offer._id },
        status: "pending",
      },
      { status: "rejected" }
    );

    return await Offer.findById(offer._id)
      .populate("listingId")
      .populate("buyerId", "name email role")
      .populate("sellerId", "name email role");
  }

  throw new Error("Invalid action");
};

module.exports = {
  createOffer,
  getUserOffers,
  respondToOffer,
};
