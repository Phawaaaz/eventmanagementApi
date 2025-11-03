const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Tech", "Music", "Business", "Education", "Other"],
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    title: {
      type: String,
      trim: true,
    },
    seats: {
      type: Number,
      default: 100,
      min: [1, 'Event must have at least 1 seat'],
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: [0, 'Booked seats cannot be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Indexes for better query performance
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ organizer: 1 });

// Virtual populate - Reviews
eventSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'event',
});

// Virtual populate - Bookings
eventSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'event',
});

// Virtual for average rating
eventSchema.virtual('averageRating').get(function() {
  // This will be calculated dynamically when needed
  return null; // Will be populated by aggregation
});

// Virtual for number of reviews
eventSchema.virtual('numReviews').get(function() {
  // This will be calculated dynamically when needed
  return null; // Will be populated by aggregation
});

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
  return this.seats - this.bookedSeats;
});

// INSTANCE METHODS

// Method to check if event is sold out
eventSchema.methods.isSoldOut = function() {
  return this.bookedSeats >= this.seats;
};

// Method to book seats
eventSchema.methods.bookSeats = async function(numSeats) {
  if (this.bookedSeats + numSeats > this.seats) {
    throw new Error('Not enough available seats');
  }
  
  this.bookedSeats += numSeats;
  await this.save();
  return this;
};

// Method to cancel booking
eventSchema.methods.cancelBooking = async function(numSeats) {
  if (this.bookedSeats < numSeats) {
    throw new Error('Cannot cancel more seats than booked');
  }
  
  this.bookedSeats -= numSeats;
  await this.save();
  return this;
};

// Method to soft delete
eventSchema.methods.softDelete = async function() {
  this.isActive = false;
  await this.save();
  return this;
};
module.exports = mongoose.model("Event", eventSchema);
