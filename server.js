const app = require("./app.js");
const dotenv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

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
