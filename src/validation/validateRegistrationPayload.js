const HttpError = require('../errors/HttpError');
const isNonEmptyString = require('../utils/isNonEmptyString');
const isValidEmail = require('../utils/isValidEmail');
const requireObjectBody = require('./requireObjectBody');

const validateRegistrationPayload = (body) => {
  const { name, email } = requireObjectBody(body);

  if (!isNonEmptyString(name)) throw HttpError.badRequest('Поле name должно быть непустой строкой');
  if (!isValidEmail(email?.trim?.())) throw HttpError.badRequest('Поле email содержит некорректный адрес');

  return { name: name.trim(), email: email.trim() };
};

module.exports = validateRegistrationPayload;
