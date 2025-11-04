process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log("Error name:", err.name);
  console.log("Error message:", err.message);
  console.log("Full stack trace:");
  console.log(err.stack);
  process.exit(1);
});

const dotenv = require("dotenv").config({ path: "./.env" });
const app = require("./app.js");
const mongoose = require("mongoose");
// app.use(express.json());
const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
