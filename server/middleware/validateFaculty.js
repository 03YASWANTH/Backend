const { Counsellor } = require("../models/counsellor");

const validateCounsellorData = async (req, res, next) => {
  try {
    const parsedData = req.paesedDataFromFile;
    const ids = parsedData.map((item) => item.counsellorId);
    const emails = parsedData.map((item) => item.email);

    const existingCounsellors = await Counsellor.find({
      $or: [{ counsellorId: { $in: ids } }, { email: { $in: emails } }],
    });

    const existingIds = existingCounsellors.map((c) => c.counsellorId);
    const existingEmails = existingCounsellors.map((c) => c.email);

    const filteredData = parsedData.filter(
      (item) =>
        !existingIds.includes(item.counsellorId) &&
        !existingEmails.includes(item.email)
    );

    if (filteredData.length === 0) {
      return res.status(400).json({
        message:
          "No new counsellor data to insert; all entries are duplicates.",
      });
    }

    const invalidData = parsedData.filter(
      (item) =>
        existingIds.includes(item.counsellorId) ||
        existingEmails.includes(item.email)
    );

    req.filteredData = filteredData;
    req.invalidData = invalidData;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Validation error", error: error.message });
  }
};

module.exports = { validateCounsellorData };
