const HttpError = require('../errors/HttpError');
const isNonEmptyString = require('../utils/isNonEmptyString');
const isValidDate = require('../utils/isValidDate');
const requireObjectBody = require('./requireObjectBody');

const TEXT_FIELDS = ['title', 'category', 'location'];

const validateEventPayload = (body) => {
  const { title, category, date, location, capacity } = requireObjectBody(body);

  const invalidTextFields = TEXT_FIELDS.filter((field) => !isNonEmptyString(body[field]));
  if (invalidTextFields.length)
    throw HttpError.badRequest(
      `Поля должны быть непустыми строками: ${invalidTextFields.join(', ')}`,
    );
  if (!isValidDate(date))
    throw HttpError.badRequest('Поле date должно быть реальной датой в формате YYYY-MM-DD');
  if (!Number.isInteger(capacity) || capacity < 1)
    throw HttpError.badRequest('Поле capacity должно быть целым числом не меньше 1');

  return {
    title: title.trim(),
    category: category.trim(),
    date,
    location: location.trim(),
    capacity,
  };
};

module.exports = validateEventPayload;
