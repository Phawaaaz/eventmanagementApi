const Booking = require("../models/bookingModel");
const Event = require("../models/eventModels");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const emailTemplates = require("../utils/emailTemplates");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Allow filtering by user or event
  if (req.params.userId) filter.user = req.params.userId;
  if (req.params.eventId) filter.event = req.params.eventId;
  
  // If user is not admin, only show their own bookings
  if (req.user.role !== "admin" && !req.params.userId) {
    filter.user = req.user.id;
  }

  const bookings = await Booking.find(filter);

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  // Get event and user IDs
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;

  const event = await Event.findById(req.body.event);
  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  // Check if event is sold out
  if (event.isSoldOut()) {
    return next(new AppError("Event is sold out", 400));
  }

  const numSeats = req.body.numSeats || 1;
  const price = event.price * numSeats;

  // Check if there are enough seats
  if (event.bookedSeats + numSeats > event.seats) {
    return next(
      new AppError(
        `Not enough seats available. Only ${event.seats - event.bookedSeats} seats remaining`,
        400
      )
    );
  }

  // Create booking
  const booking = await Booking.create({
    event: req.body.event,
    user: req.body.user,
    price,
    numSeats,
  });

  // Update event bookedSeats
  await event.bookSeats(numSeats);

  // Send booking confirmation email
  try {
    const user = await User.findById(req.body.user);
    if (user) {
      const bookingEmail = emailTemplates.bookingConfirmation(booking, event, user.name);
      await sendEmail({
        email: user.email,
        subject: bookingEmail.subject,
        message: bookingEmail.message,
        html: bookingEmail.html,
      });
    }
  } catch (err) {
    // Don't fail booking if email fails
    console.error('Error sending booking confirmation email:', err);
  }

  res.status(201).json({
    status: "success",
    data: {
      booking,
    },
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }

  // Check if user owns this booking or is admin (convert to string for comparison)
  const userId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
  if (userId !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to view this booking", 403)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }

  // Only admin can update bookings
  if (req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }

  // Check if user owns this booking or is admin (convert to string for comparison)
  const userId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
  if (userId !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to cancel this booking", 403)
    );
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Booking is already cancelled", 400));
  }

  // Update booking status
  booking.status = "cancelled";
  await booking.save();

  // Update event bookedSeats
  const event = await Event.findById(booking.event);
  if (event) {
    await event.cancelBooking(booking.numSeats);
  }

  // Send cancellation email
  try {
    const user = await User.findById(booking.user);
    if (user && event) {
      const cancellationEmail = emailTemplates.bookingCancellation(booking, event, user.name);
      await sendEmail({
        email: user.email,
        subject: cancellationEmail.subject,
        message: cancellationEmail.message,
        html: cancellationEmail.html,
      });
    }
  } catch (err) {
    // Don't fail cancellation if email fails
    console.error('Error sending cancellation email:', err);
  }

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }

  // Only admin can delete bookings
  if (req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  // If booking is confirmed, update event seats
  if (booking.status === "confirmed") {
    const event = await Event.findById(booking.event);
    if (event) {
      await event.cancelBooking(booking.numSeats);
    }
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

