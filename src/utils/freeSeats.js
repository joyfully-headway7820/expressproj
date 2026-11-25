const freeSeats = ({ capacity, registrations }) => capacity - registrations.length;

module.exports = freeSeats;
