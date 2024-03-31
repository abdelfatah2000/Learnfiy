const express = require('express');
const authRoutes = require('./routes/auth.routes');
const connection = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const errorHandlers = require('./handlers/errorHandler');
const passport = require('passport');
const jwtStrategy = require('./config/passport');
const { rateLimiterByIP } = require('./utils/rateLimiter');

require('dotenv').config();
connection();

// Define passport js
passport.use('JWT', jwtStrategy);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Define routes
app.use('/api/auth', authRoutes);
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
  res.send("hello");
});

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Define error handlers
app.use(errorHandlers.ErrorHandler);
app.use(errorHandlers.NotFoundHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
