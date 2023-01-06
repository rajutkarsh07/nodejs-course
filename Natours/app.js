const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////   MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //it will save public as root folder

//this is middleware
//this middleware applies to each and every request
//.route is also a middleware but it only work for one request
app.use((req, res, next) => {
  console.log('this is middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTIme = new Date().toISOString();
  // console.log(req.requestTIme);
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

module.exports = app;
