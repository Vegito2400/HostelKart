const reportService = require("./report.service");

const create = async (req, res, next) => {
  try {
    const report = await reportService.createReport(
      req.body,
      req.user._id
    );
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const reports = await reportService.getAllReports();
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const report = await reportService.updateReportStatus(
      req.params.id,
      req.body.status
    );
    res.json(report);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, updateStatus };