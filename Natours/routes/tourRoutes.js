const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

//router.param('id', (req, res, next, val) => {}); //this middleware will run for id parameter only
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); // we can add multiple middleware
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
