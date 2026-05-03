const Listing = require("./listing.model");
// const redis = require("../../config/redis");

const clearListingsCache = async () => {
  try {
    const keys = await redis.keys("listings:*");
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.warn("Redis cache clear skipped:", error.message);
  }
};
const createListing = async (data, userId) => {
    await clearListingsCache();
  return await Listing.create({
    ...data,
    sellerId: userId,
  });
};


const getListings = async (query) => {
  const cacheKey = `listings:${JSON.stringify(query)}`;

  // 1. Check cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache HIT");
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn("Redis cache read skipped:", error.message);
  }

  console.log("Cache MISS");
  const { page = 1, limit = 50, category, minPrice, maxPrice, search, sellerId } = query;

  const filter = sellerId ? { sellerId } : { status: "active" };

  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let mongoQuery = Listing.find(filter);

  // Text search
  if (search) {
    mongoQuery = mongoQuery.find({
      $text: { $search: search },
    });
  }

  const listings = await mongoQuery
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .populate("sellerId", "name email role");

  try {
    await redis.set(cacheKey, JSON.stringify(listings), "EX", 60);
  } catch (error) {
    console.warn("Redis cache write skipped:", error.message);
  }

  return listings;
};

const getListingById = async (id) => {
  return await Listing.findById(id).populate("sellerId", "name email");
};

const updateListing = async (id, userId, data) => {
    await clearListingsCache();
    const listing = await Listing.findById(id);

  if (!listing) throw new Error("Listing not found");

  if (listing.sellerId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  Object.assign(listing, data);
  return await listing.save();
};

const deleteListing = async (id, userId) => {
    await clearListingsCache();
    const listing = await Listing.findById(id);

  if (!listing) throw new Error("Listing not found");

  if (listing.sellerId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  await listing.deleteOne();
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
};
