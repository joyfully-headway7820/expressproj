const freeSeats = require('./freeSeats');

const toSummary = ({ id, title, registrations }) => ({
  id,
  title,
  registrationsCount: registrations.length,
});

const buildStats = (events) => {
  const mostPopular = events.reduce(
    (top, event) => (!top || event.registrations.length > top.registrations.length ? event : top),
    null,
  );

  return {
    totalEvents: events.length,
    totalRegistrations: events.reduce((sum, { registrations }) => sum + registrations.length, 0),
    eventsWithFreeSeats: events.filter((event) => freeSeats(event) > 0).length,
    mostPopularEvent: mostPopular && toSummary(mostPopular),
  };
};

module.exports = buildStats;
