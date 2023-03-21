const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////   MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // means 100 request per hour
  message: 'To many request from this IP, try again after an hour',
});

app.use('/api', limiter); // this middleware will be applied to only those routes whose url starts with /api

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //it will save public as root folder

//this is middleware
//this middleware applies to each and every request
//.route is also a middleware but it only work for one request
//app.use((req, res, next) => {
// console.log('this is middleware');
// next();
//});

app.use((req, res, next) => {
  req.requestTIme = new Date().toISOString();
  // console.log(req.requestTIme);
  console.log(req.headers);
  next();
});

// app.get('/', (req, res) => {
//   // res.status(200).send('hello i am server');
//   res.status(200).json({ message: 'hello i am server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint...');
// });

////////////   ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

////////////   ROUTES

// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

app.use('/api/v1/tours', tourRouter); //This is also a middleware here it means for this route we want to apply tourRouter middleware
app.use('/api/v1/users', userRouter); //This is also a middleware

// If the code run upto this means request response cycle is not finished yet then it will show html error we have to change it
// This will run for all the http methods because of all and *
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // If anything is passed in next function then express will know that it is error
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// four arguments in use means error
app.use(globalErrorHandler);

module.exports = app;
