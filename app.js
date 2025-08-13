const express = require("express");
const app = express();

const eventRouter = require("./route/event");

app.use(express.json());

app.use("/api/v1/event", eventRouter);

module.exports = app;
