const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: [true, "Booking must belong to an event"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Booking must belong to a user"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    numSeats: {
      type: Number,
      required: [true, "Booking must specify number of seats"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    paid: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Indexes for better query performance
bookingSchema.index({ event: 1, user: 1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Populate user and event when querying
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email photo",
  }).populate({
    path: "event",
    select: "name date location price seats",
  });
  next();
});

// Virtual for total amount (redundant but useful for clarity)
bookingSchema.virtual('totalAmount').get(function() {
  return this.price;
});

// Pre-save hook to validate booking (optional - validation is done in controller)
// This serves as a backup validation layer
bookingSchema.pre('save', async function(next) {
  // Skip validation if status is being changed to cancelled
  if (this.isModified('status') && this.status === 'cancelled') {
    return next();
  }

  // Only validate on new bookings or when numSeats changes
  if (this.isNew || this.isModified('numSeats')) {
    try {
      const Event = mongoose.model('Event');
      const event = await Event.findById(this.event);
      
      if (!event) {
        return next(new Error('Event not found'));
      }
      
      // Additional validation: ensure event has enough seats
      // Note: Main validation is done in controller before saving
      if (event.bookedSeats + this.numSeats > event.seats) {
        return next(new Error('Not enough seats available'));
      }
    } catch (err) {
      return next(err);
    }
  }
  
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);

