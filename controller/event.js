const Event = require("./../models/eventModels");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // req.query object
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering: gte/gt/lte/lt -> $gte/$gt/$lte/$lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

/* -------------------- CONTROLLERS -------------------- */

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: "success",
      data: { event: newEvent },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "No event found with that ID" });
    }
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "No event found with that ID" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "No event found with that ID" });
    }
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
