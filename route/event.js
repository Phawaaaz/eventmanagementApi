const express = require("express");
const eventController = require("./../controller/event");

const router = express.Router();

router
  .route("/")
  .post(eventController.createEvent)
  .get(eventController.getAllEvents);

module.exports = router;
