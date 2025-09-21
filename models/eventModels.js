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
    seats: {
      type: Number,
      default: 100,
    },
    price: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
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
