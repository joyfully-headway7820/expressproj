const HttpError = require('../errors/HttpError');

const requireObjectBody = (body) => {
  if (body === null || typeof body !== 'object' || Array.isArray(body))
    throw HttpError.badRequest('Тело запроса должно быть JSON-объектом');
  return body;
};

module.exports = requireObjectBody;
