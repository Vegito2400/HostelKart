const Offer = require("./offer.model");
const Listing = require("../listings/listing.model");

const createOffer = async ({ listingId, offeredPrice }, buyerId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) throw new Error("Listing not found");

  if (listing.status !== "active") {
    throw new Error("Listing not available");
  }

  if (listing.sellerId.toString() === buyerId.toString()) {
    throw new Error("You cannot offer on your own listing");
  }

  return await Offer.create({
    listingId,
    buyerId,
    sellerId: listing.sellerId,
    offeredPrice,
  });
};

const getUserOffers = async (userId) => {
  return await Offer.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
  })
    .populate("listingId")
    .sort({ createdAt: -1 });
};

const respondToOffer = async (offerId, sellerId, action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const offer = await Offer.findById(offerId).session(session);

    if (!offer) throw new Error("Offer not found");

    if (offer.sellerId.toString() !== sellerId.toString()) {
      throw new Error("Not authorized");
    }

    if (offer.status !== "pending") {
      throw new Error("Offer already processed");
    }

    if (action === "reject") {
      offer.status = "rejected";
      await offer.save({ session });

      await session.commitTransaction();
      session.endSession();
      return offer;
    }

    if (action === "accept") {
      const listing = await Listing.findOneAndUpdate(
        {
          _id: offer.listingId,
          status: "active",
        },
        {
          status: "reserved",
        },
        { new: true, session }
      );


      if (!listing) {
        throw new Error("Listing already reserved by another offer");
      }

      // Mark this offer accepted
      offer.status = "accepted";
      await offer.save({ session });

      // Reject all other offers
      await Offer.updateMany(
        {
          listingId: offer.listingId,
          _id: { $ne: offer._id },
          status: "pending",
        },
        { status: "rejected" },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return offer;
    }

    throw new Error("Invalid action");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  createOffer,
  getUserOffers,
  respondToOffer,
};