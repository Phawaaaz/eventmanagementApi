const express = require("express");
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route("/")
  .get(authController.protect, bookingController.getAllBookings)
  .post(authController.protect, bookingController.createBooking);

router
  .route("/:id")
  .get(authController.protect, bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.patch("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
