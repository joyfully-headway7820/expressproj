const freeSeats = require('./freeSeats');

const serializeEvent = (event) => ({
  ...event,
  registrationsCount: event.registrations.length,
  freeSeats: freeSeats(event),
});

module.exports = serializeEvent;
