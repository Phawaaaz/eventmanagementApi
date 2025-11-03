const express = require("express");
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.patch("/:id/cancel", bookingController.cancelBooking);

module.exports = router;

