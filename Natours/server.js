const mongoose = require('mongoose');
const dotenv = require('dotenv');

//below code will show error when we console.log any varible that is not declared
process.on('uncaughtException', (err) => {
  console.log('unhandle exception process shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongodb://localhost:27017/natours

// the other 3 parameter in the .connect is compulsory for showing error
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('DB connenction successful');
  });

// console.log(process.env);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//mongodb+srv://root:<password>@cluster0.i5vh4hu.mongodb.net/test

//any other promise rejection that we might not catch somewhere in the application is handled here,

process.on('unhandleRejection', (err) => {
  console.log('unhandle rejection process shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(utkarsh);
