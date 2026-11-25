const HttpError = require('../errors/HttpError');
const requireObjectBody = require('./requireObjectBody');

const validateTransferPayload = (body) => {
  const { targetEventId } = requireObjectBody(body);

  if (!Number.isInteger(targetEventId) || targetEventId < 1)
    throw HttpError.badRequest('Поле targetEventId должно быть положительным целым числом');

  return { targetEventId };
};

module.exports = validateTransferPayload;
