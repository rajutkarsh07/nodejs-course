const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await user.create(req.body); //don't use this to create newUser it may lead to security flaws as anyone can grant itself admin
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email password exist

  if (!email || !password) {
    // console.log('--------req.body--------');
    // console.log(req.body);
    return next(new AppError('Please provide email and password', 400));
  }

  // check if user exists && password is correct

  const user = await User.findOne({ email: email }).select('+password');
  // if everything is ok send jwt token

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  // console.log(user);
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // we will add authorization header on get request and it's value starts with bearer followed by token
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get access', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decode);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (!currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('user recently chagned password, try new password', 401)
  //   );
  // }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles will be an array ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there is no user with this email address', 404));
  }

  // generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? make a patch request with your password and password 
  confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      // email: user.email, //we can also use req.body.email
      // subject: 'your password reset token (valid for 10 min)',
      // message,
      // fromEmail,
      message,
      toEmail: req.body.toEmail,
    });

    res.status(200).json({
      status: 'success',
      message: 'token send to email, please check your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token has no expired, and there is user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update changedPasswordAt property for the user
  // log the user in, send jWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // check if POSTed current password is correct
  const { password, newPassword } = req.body;
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('incorrect current password', 401));
  }
  // if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate will not work as intended

  // log user in, send JWT
  createSendToken(user, 200, res);
});
