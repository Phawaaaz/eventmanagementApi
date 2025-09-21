const express = require("express");
const userController = require("../controller/userController");
const auth = require("../controller/authController");

const router = express.Router();

router.post("/signup", auth.signup);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);