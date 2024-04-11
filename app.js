const express = require('express');
const connection = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const errorHandlers = require('./handlers/errorHandler');
const passport = require('passport');
const jwtStrategy = require('./config/passport');
const { rateLimiterByIP } = require('./utils/rateLimiter');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

require('dotenv').config();
connection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define passport js
jwtStrategy(passport);

//Define routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 3000;

//Define swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Learnify Documentation',
      version: '1.0.0',
      description: 'API documentation for Learnfiy',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./swagger/*.yaml'],
};

app.get('/', (req, res) => {
  res.send('hello');
});

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Define error handlers
// app.use(errorHandlers.ErrorHandler);
app.use(errorHandlers.NotFoundHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
