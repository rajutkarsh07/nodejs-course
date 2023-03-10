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
    toJSON: { virtuals: true }, //making virtual visible in json
    toObject: { virtuals: true }, //making virtual visible in object
  }
);

//we cannot use this virtual property here in a query, because they're technically not part of the database.

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// mongoose document middleware: runs before .save() and .create()
// pre save only trigerred by .save() and .create() not by any other function like findById
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //this will slugify the name and make all the text to lowercase this has access to currently being saved document
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('saving document...');
//   next();
// });

// post will be executed after all the pre middleware have completed
// tourSchema.post('save', function (doc, next) {
//   console.log(doc); // this will print the doc/jsonObj which we have posted
//   next();
// });

// query middleware

// find query will point to current query not current document
tourSchema.pre(/^find/, function (next) {
  // /^find will trigger all the commands that starts with find eg findOne, findXYZ etc.
  // as we want this to trigger to findOne method also that's why we have used /^find/ instead of creating two pre 'find' and 'findOne'
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } }); // this will hide all the secretTour that is true and return a json obj without secretTour obj but our database will have all the json obj including that one which has secretTour
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
// we want to hide the secret key from aggregrate middleware also
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift to add at the beginning of the array
  // console.log(this.pipeline()); // this will show the aggregrate array which we have defined
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
