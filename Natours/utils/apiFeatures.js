class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // 1a) filtering

    // console.log(req.query); this returns object that is written in param here it is 127.0.0.1:4000/api/v1/tours?duration=5&difficulty=easy
    // const tours = await Tour.find(); this will get all the tours

    const queryObj = { ...this.queryString }; //we will store all the fields from the params
    const excludeFiles = ['page', 'sort', 'limit', 'fields']; //we want all the fields from the params excluding these fields
    excludeFiles.forEach((e) => delete queryObj[e]); // delete all the non required fileds from the object

    // 1b) advanced filtering

    //gte, gt, lte, lt
    //{difficulty : 'easy', duration : { $gte: 5 } } we want this
    //{difficulty : 'easy', duration : { gte: '5' } } will return this
    //duration[gte]=5 in the params

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //for this type of params sortBy=rating,price
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //excluding __v by using - sign as it gets created by mongoose idk why
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    //page=3&limit=10, means page 1 is 1-10, page 2 is 11-20
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
