const { PORT, DATA_FILE } = require('./src/config');
const JsonFileStorage = require('./src/storage/JsonFileStorage');
const EventRepository = require('./src/repository/EventRepository');
const EventService = require('./src/services/EventService');
const createApp = require('./src/createApp');

const repository = new EventRepository(new JsonFileStorage(DATA_FILE));
repository.init();

createApp(new EventService(repository)).listen(PORT, () =>
  console.log(`Сервер запущен: http://localhost:${PORT}`),
);
