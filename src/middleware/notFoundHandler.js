const HttpError = require('../errors/HttpError');

const notFoundHandler = ({ method, originalUrl }, res, next) =>
  next(HttpError.notFound(`Маршрут ${method} ${originalUrl} не найден`));

module.exports = notFoundHandler;
