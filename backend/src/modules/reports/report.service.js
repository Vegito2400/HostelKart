const Report = require("./report.model");
const Listing = require("../listings/listing.model");
const mongoose = require("mongoose");

const createReport = async ({ listingId, reason, description, details }, userId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new Error("Invalid listing id. Please refresh the page and try again.");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) throw new Error("Listing not found");

  // Prevent duplicate reports from same user
  const existing = await Report.findOne({
    listingId,
    reporterId: userId,
  });

  if (existing) {
    throw new Error("You have already reported this listing");
  }

  return await Report.create({
    listingId,
    reporterId: userId,
    reason,
    description: description ?? details ?? "",
  });
};

const getAllReports = async () => {
  return await Report.find()
    .populate("listingId")
    .populate("reporterId", "name email")
    .sort({ createdAt: -1 });
};

const updateReportStatus = async (reportId, status) => {
  const report = await Report.findById(reportId);

  if (!report) throw new Error("Report not found");

  report.status = status;
  return await report.save();
};

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus,
};
