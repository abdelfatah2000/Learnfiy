const mongoose = require('mongoose');
const logger = require('./logger');

require('dotenv').config();

const connection = () => {
  return mongoose
    .connect(process.env.CONNECTION_STRING, {})
    .then(() => logger.info('Database Connected'))
    .catch((err) => console.log(err));
};

module.exports = connection;
