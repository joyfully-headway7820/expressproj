const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const createEventsRouter = require('./routes/createEventsRouter');
const createStatsRouter = require('./routes/createStatsRouter');

const createApp = (service) => {
  const app = express();

  app.use(requestLogger);
  app.use(express.json());
  app.use('/events', createEventsRouter(service));
  app.use('/stats', createStatsRouter(service));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
