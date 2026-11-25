const freeSeats = require('./freeSeats');

const SORT_KEYS = {
  date: ({ date }) => date,
  freeSeats,
};

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const sortEvents = (events, sort, order) => {
  if (!sort) return events;
  const getKey = SORT_KEYS[sort];
  const direction = order === 'desc' ? -1 : 1;
  return [...events].sort((a, b) => direction * compare(getKey(a), getKey(b)) || a.id - b.id);
};

module.exports = sortEvents;
