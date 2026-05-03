const listingService = require("./listing.service");

const create = async (req, res, next) => {
  try {
    const listing = await listingService.createListing(
      req.body,
      req.user._id
    );
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const listings = await listingService.getListings(req.query);
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const listing = await listingService.updateListing(
      req.params.id,
      req.user._id,
      req.body
    );
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id, req.user._id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };