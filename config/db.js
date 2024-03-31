const mongoose = require('mongoose');
require('dotenv').config();

const connection = () => {
  return mongoose
    .connect(process.env.CONNECTION_STRING, {})
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));
};

module.exports = connection;
