const express = require("express");
const app = express();
const morgan = require("morgan");

const eventRouter = require("./route/event");
const userRouter = require("./route/userRoutes");
const reviewRouter = require("./route/review");
const bookingRouter = require("./route/booking");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
// ...................Middlewares...................
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// Routes Handlers
app.get("/", (req, res) => {
  res
    .status(200) // ✅ Changed from 400 to 200 (success status)
    .json({
      message: "Event management Server side, hello from the other side",
      app: "Event Management",
    });
});

// Routes
// Main Routers
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

// Nested routes - Reviews and Bookings under Events
app.use("/api/v1/event/:eventId/reviews", reviewRouter);
app.use("/api/v1/event/:eventId/bookings", bookingRouter);

// Handle unmatched routes (404)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // ✅ Fixed: AppError with uppercase
});

app.use(globalErrorHandler);

module.exports = app;
