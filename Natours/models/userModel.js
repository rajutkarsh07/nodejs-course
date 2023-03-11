const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Input valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm password should be same as the password'],
    validate: {
      // this will only work on create save
      validator: function (e) {
        return e == this.password;
      },
      message: 'password must be same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // this function will only run if the password was actually modified
  if (!this.isModified('password')) return next();

  // hashing the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // deleting confirm password field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     // console.log(changedTimestamp, JWTTimestamp);

//     return JWTTimestamp < changedTimestamp;
//   }

//   return false;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
