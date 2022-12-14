const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // " hello" "hello" "hello " will make all these same
      maxlength: [50, 'A tour name must have less than 50 characters'],
      minlength: [10, 'A tour name must have more than 10 characters'],
      //below is using validator library
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], this function is also excluding spaces
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'you can enter only easy, medium and difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'mininum rating can be 1.0'],
      max: [5, 'maximum rating can be 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //custom validator this should only return true or false
      validate: {
        validator: function (val) {
          // this only points to current doc on new document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// document middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //this has access to currently being saved document
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('saving document...');
//   next();
// });

// post will be executed after all the pre middleware have completed
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// query middleware
// find query will point to current query not current document
tourSchema.pre(/^find/, function (next) {
  // /^find will trigger all the commands that starts with find eg findOne, findXYZ etc.
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now()} - this.start milliseconds`);
  // console.log(docs);
  next();
});

// Aggregation middleware
//this runs before and after the execution
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift to add at the beginning of the array
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
