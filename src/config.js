const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'events.json');

const SORT_FIELDS = ['date', 'freeSeats'];
const SORT_ORDERS = ['asc', 'desc'];

module.exports = { PORT, DATA_FILE, SORT_FIELDS, SORT_ORDERS };
