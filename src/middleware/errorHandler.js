const HttpError = require('../errors/HttpError');

const toHttpError = (error) => {
  if (error instanceof HttpError) return error;
  if (error.type === 'entity.parse.failed') return HttpError.badRequest('Некорректный JSON в теле запроса');
  if (error.type === 'entity.too.large') return new HttpError(413, 'Тело запроса слишком большое');
  if (error.type === 'encoding.unsupported' || error.type === 'charset.unsupported')
    return HttpError.badRequest('Неподдерживаемая кодировка тела запроса');
  return null;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const httpError = toHttpError(error);
  if (!httpError) {
    console.error(error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
  return res.status(httpError.status).json({ error: httpError.message });
};

module.exports = errorHandler;
