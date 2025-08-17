const Event = require("./../models/eventModels");

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: "sucess",
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Event.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join("");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // Limiting
    const fields = req.query.fields.split(",").join(" ");
    if (fields) {
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    if (req.query.page) {
      const numEvents = await Event.countDocuments();
      if (skip >= numEvents) {
        throw new Error("This page does not exist");
      }
    }

    const events = await query;
    res.status(200).json({
      status: "success",
      results: events.length,
      data: {
        events,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.param.id);

    if (!event) {
      return res.status(404).json({
        status: "fail",
        message: "No event found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.param.id);
    if (!event) {
      return res.status(404).json({
        status: "fail",
        message: "no event found with that id",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = Event.findByIdAndUpdate(req.param.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(203).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
