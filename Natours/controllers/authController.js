const user = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await user.create(req.body);
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // check if email password exist

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if user exists && password is correct

  const user = user.findOne({ email: email });
  // if everything is ok send jwt token

  const token = '';
  res.status(200).json({
    status: 'success',
    token,
  });
};
