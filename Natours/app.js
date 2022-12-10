const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // res.status(200).send('hello i am server');
  res.status(200).json({ message: 'hello i am server', app: 'Natours' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
