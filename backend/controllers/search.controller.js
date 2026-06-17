const Booking = require("../models/booking.model");

// Helper wrapper for async endpoints
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const searchGeneral = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  if (!keyword || String(keyword).trim() === "") {
    return res.status(400).json({ success: false, message: "keyword query parameter is required" });
  }

  const cleanKeyword = escapeRegex(String(keyword).trim());
  const searchRegex = { $regex: cleanKeyword, $options: "i" };

  const query = {
    isDeleted: false,
    $or: [
      { bookingId: searchRegex },
      { customerId: searchRegex },
      { bookingStatus: searchRegex },
      { vehicleType: searchRegex },
      { pickupLocation: searchRegex },
      { dropLocation: searchRegex },
      { paymentMethod: searchRegex },
      { cancelledByCustomerReason: searchRegex },
      { cancelledByDriverReason: searchRegex },
      { incompleteReason: searchRegex }
    ]
  };

  const results = await Booking.find(query).limit(100).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchBookingsById = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;
  if (!bookingId) return res.status(400).json({ success: false, message: "bookingId query parameter is required" });

  const cleanId = escapeRegex(String(bookingId).trim());
  const results = await Booking.find({ bookingId: { $regex: cleanId, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchCustomersById = asyncHandler(async (req, res) => {
  const { customerId } = req.query;
  if (!customerId) return res.status(400).json({ success: false, message: "customerId query parameter is required" });

  const cleanId = escapeRegex(String(customerId).trim());
  const results = await Booking.find({ customerId: { $regex: cleanId, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchPaymentByMethod = asyncHandler(async (req, res) => {
  const { method } = req.query;
  if (!method) return res.status(400).json({ success: false, message: "method query parameter is required" });

  const cleanMethod = escapeRegex(String(method).trim());
  const results = await Booking.find({ paymentMethod: { $regex: cleanMethod, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchVehicleByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ success: false, message: "type query parameter is required" });

  const cleanType = escapeRegex(String(type).trim());
  const results = await Booking.find({ vehicleType: { $regex: cleanType, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchPickupLocation = asyncHandler(async (req, res) => {
  const { pickup } = req.query;
  if (!pickup || String(pickup).trim() === "") {
    return res.status(400).json({ success: false, message: "pickup query parameter is required" });
  }
  const cleanPickup = escapeRegex(String(pickup).trim());
  const results = await Booking.find({ pickupLocation: { $regex: cleanPickup, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchDropLocation = asyncHandler(async (req, res) => {
  const { drop } = req.query;
  if (!drop || String(drop).trim() === "") {
    return res.status(400).json({ success: false, message: "drop query parameter is required" });
  }
  const cleanDrop = escapeRegex(String(drop).trim());
  const results = await Booking.find({ dropLocation: { $regex: cleanDrop, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchCancelReason = asyncHandler(async (req, res) => {
  const { reason } = req.query;
  if (!reason) return res.status(400).json({ success: false, message: "reason query parameter is required" });

  const cleanReason = escapeRegex(String(reason).trim());
  const searchRegex = { $regex: cleanReason, $options: "i" };

  const results = await Booking.find({
    isDeleted: false,
    $or: [
      { cancelledByCustomerReason: searchRegex },
      { cancelledByDriverReason: searchRegex }
    ]
  }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchIncompleteReason = asyncHandler(async (req, res) => {
  const { reason } = req.query;
  if (!reason) return res.status(400).json({ success: false, message: "reason query parameter is required" });

  const cleanReason = escapeRegex(String(reason).trim());
  const results = await Booking.find({ incompleteReason: { $regex: cleanReason, $options: "i" }, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchDriverRating = asyncHandler(async (req, res) => {
  const { driver } = req.query;
  const ratingVal = parseFloat(driver);
  if (isNaN(ratingVal)) return res.status(400).json({ success: false, message: "Invalid driver rating value" });

  const results = await Booking.find({ driverRating: ratingVal, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

const searchCustomerRating = asyncHandler(async (req, res) => {
  const { customer } = req.query;
  const ratingVal = parseFloat(customer);
  if (isNaN(ratingVal)) return res.status(400).json({ success: false, message: "Invalid customer rating value" });

  const results = await Booking.find({ customerRating: ratingVal, isDeleted: false }).lean();
  return res.status(200).json({ success: true, count: results.length, data: results });
});

module.exports = {
  searchGeneral,
  searchBookingsById,
  searchCustomersById,
  searchPaymentByMethod,
  searchVehicleByType,
  searchPickupLocation,
  searchDropLocation,
  searchCancelReason,
  searchIncompleteReason,
  searchDriverRating,
  searchCustomerRating,
};
