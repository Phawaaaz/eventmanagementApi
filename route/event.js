const express = require("express");
const eventController = require("./../controller/event");

const router = express.Router();

router.get(
  "/top-10-upcoming",
  eventController.aliasTopUpcoming,
  eventController.getAllEvents
);

router.get("/event-stats", eventController.eventStat);
router.get("/monthly-plan/:year", eventController.getMonthlyPlan);
router.get("/price-analysis", eventController.getPriceAnalysis);

router
  .route("/")
  .post(eventController.createEvent)
  .get(eventController.getAllEvents);

router
  .route("/:id")
  .get(eventController.getEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);
module.exports = router;
