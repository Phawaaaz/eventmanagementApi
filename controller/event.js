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
    const events = await Event.find();
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
}

exports.getEvent = async (req, res) => {
  try{
    const event = await Event.findById(req.param.id)

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

  }catch (err){
    res.status(400).json({
      status: "fail",
      error: err,
  });
  }
}