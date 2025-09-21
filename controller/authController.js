const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next)=>{
   const newUser = await User.create({
      name : req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
   })

   res.status(201).json({
      status: success,
      data:{
         user: newUser
      }
   })
})

exports.login = catchAsync(async(req, res, next) => {

   // Check if the email and password exist
   if(!email || !password){
      return next (new AppError('Incorrect email and password', 401))
   }
   // Check if thr user email and password is correct
   const user = await user.findOne({email}).select('+password')
   const correct =  user.correctPassword(password, user.password)
   // If evrything is oka, send token to client 

   res.status(200).json({
      status: 'sucess',
      
   })
})