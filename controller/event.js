const Event = require("./../models/eventModels");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ________________________Alias_______________________

exports.aliasTopUpcoming = (req, res, next) => {
  // only upcoming events
  req.query.date = { gte: new Date().toISOString() }; // if your schema uses startDate, use: req.query.startDate = { gte: ... }

  // shape + sort
  req.query.limit = "10";
  req.query.sort = "date"; // earliest first; use 'startDate' if that's your field
  req.query.fields = "title,location,date,price,organizer"; // tweak to your schema

  next();
};

/* -------------------- CONTROLLERS -------------------- */

exports.createEvent = catchAsync(async (req, res, next) => {
  const newEvent = await Event.create(req.body);
  res.status(201).json({
    status: "success",
    data: { event: newEvent },
  });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await features.query;

  res.status(200).json({
    status: "success",
    results: events.length,
    data: { events },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError("No event found with that id"));
  }
  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "No event found with that ID" });
    }
    res.status(200).json({ 
      status: "success", 
      data: { 
        event 
      } 
    });
});

exports.eventStat = catchAsync(async (req, res, next) => {
    const startOfToday = new Date();
    startOfToday.setHours(8, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(17, 59, 59, 999);

    const stats = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          numEvents: { $sum: 1 },
          totalSeats: { $sum: "$seats" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          upComingEvents: {
            $sum: {
              $cond: [{ $gte: ["$date", startOfToday] }, 1, 0],
            },
          },
          onGoingEvents: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$date", startOfToday] },
                    { $lte: ["$date", endOfToday] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          completedEvents: {
            $sum: {
              $cond: [{ $lt: ["$date", startOfToday] }, 1, 0],
            },
          },
          totalRevenue: {
            $sum: {
              $multiply: ["$price", "$bookedSeats"], // Assuming you have bookedSeats field
            },
          },
          avgSeats: { $avg: "$seats" },
        },
      },
      {
        $addFields: {
          upcomingPercentage: {
            $multiply: [{ $divide: ["$upComingEvents", "$numEvents"] }, 100],
          },
        },
      },
      {
        $sort: { numEvents: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: stats.length,
      data: { 
        stats 
      },
    });
  } )

exports.getPriceAnalysis = catchAsync(async (req, res, next) => { 
    const analysis = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
          medianPrice: { $push: "$price" }, // Will calculate median later
          totalRevenue: { $sum: { $multiply: ["$price", "$bookedSeats"] } },
          priceRanges: {
            $push: {
              $switch: {
                branches: [
                  { case: { $lte: ["$price", 50] }, then: "Budget (≤$50)" },
                  {
                    case: {
                      $and: [
                        { $gt: ["$price", 50] },
                        { $lte: ["$price", 150] },
                      ],
                    },
                    then: "Mid-range ($51-$150)",
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$price", 150] },
                        { $lte: ["$price", 300] },
                      ],
                    },
                    then: "Premium ($151-$300)",
                  },
                ],
                default: "Luxury (>$300)",
              },
            },
          },
        },
      },
      {
        $addFields: {
          priceVariation: { $subtract: ["$maxPrice", "$minPrice"] },
          // Calculate median (approximate using $arrayElemAt)
          sortedPrices: { $sortArray: { input: "$medianPrice", sortBy: 1 } },
        },
      },
      {
        $addFields: {
          medianPrice: {
            $arrayElemAt: [
              "$sortedPrices",
              { $floor: { $divide: [{ $size: "$sortedPrices" }, 2] } },
            ],
          },
        },
      },
      {
        $project: {
          sortedPrices: 0, // Remove temporary field
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: analysis.length,
      data: { 
        priceAnalysis: analysis 
      },
    });
  })
