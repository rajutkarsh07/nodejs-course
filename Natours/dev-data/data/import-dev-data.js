const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connenction successful');
  });

//reading json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data to database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data send to tours successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//deleting all data from the database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted from tours successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);

//node dev-data/data/import-dev-data.js\ --import in the natours directory
//node dev-data/data/import-dev-data.js\ --delete in the natours directory

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
