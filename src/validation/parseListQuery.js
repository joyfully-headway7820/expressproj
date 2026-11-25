const HttpError = require('../errors/HttpError');
const { SORT_FIELDS, SORT_ORDERS } = require('../config');

const parseAvailable = (value) => {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw HttpError.badRequest('Параметр available должен быть true или false');
};

const parseOneOf = (name, value, allowed) => {
  if (value === undefined) return undefined;
  if (!allowed.includes(value))
    throw HttpError.badRequest(`Параметр ${name} должен быть одним из: ${allowed.join(', ')}`);
  return value;
};

const parseListQuery = ({ category, available, sort, order }) => {
  if (category !== undefined && typeof category !== 'string')
    throw HttpError.badRequest('Параметр category должен быть строкой');

  return {
    category: category?.trim() || undefined,
    available: parseAvailable(available),
    sort: parseOneOf('sort', sort, SORT_FIELDS),
    order: parseOneOf('order', order, SORT_ORDERS) ?? 'asc',
  };
};

module.exports = parseListQuery;
