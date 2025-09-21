const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "User password is required"],
    minlength: 8,
    select: false, // Exclude password from query results by default
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false, // Exclude inactive users from query results by default
  },
});

userSchema.pre('save', async function (next){
  if (!this.isModified('password')) return next

  this.password = await  bcrypt.compare(candidatePassword, userPassword)

})

const User = mongoose.model('user', userSchema)

module.exports = User