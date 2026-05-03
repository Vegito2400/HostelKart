const offerService = require("./offer.service");

const create = async (req, res, next) => {
  try {
    const offer = await offerService.createOffer(
      req.body,
      req.user._id
    );
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
};

const getMyOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getUserOffers(req.user._id);
    res.json(offers);
  } catch (err) {
    next(err);
  }
};

const respond = async (req, res, next) => {
  try {
    const { action } = req.body; 

    const offer = await offerService.respondToOffer(
      req.params.id,
      req.user._id,
      action
    );

    res.json(offer);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getMyOffers, respond };