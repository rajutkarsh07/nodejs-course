const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTIme);
  try {
    console.log(req.query);
    //filtering

    // console.log(req.query); this returns object that is written in param here it is 127.0.0.1:4000/api/v1/tours?duration=5&difficulty=easy
    // const tours = await Tour.find(); this will get all the tours

    const queryObj = { ...req.query };
    const excludeFiles = ['page', 'sort', 'limit', 'fields'];
    excludeFiles.forEach((e) => delete queryObj[e]);

    // console.log(req.query, queryObj);

    //first build the query

    //advanced filtering

    //gte, gt, lte, lt
    //{difficulty : 'easy', duration : { $gte: 5 } } we want this
    //{difficulty : 'easy', duration : { gte: '5' } } will return this
    //duration[gte]=5 in the params

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const query = Tour.find(queryObj);
    const query = Tour.find(JSON.parse(queryObj));

    //then attach await
    const tours = await query;

    //Getting tours with conditions
    // const tours = Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    //Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body); //req.body is the data that comes from post request

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    //findByIdUpdate contains 3 parameters
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //true will return the modified document rather than the original default value is false
      runValidators: true, //these two lines are important for updating the database
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};
