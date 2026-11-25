const {
  SEED_EVENTS,
  SEED_NEXT_EVENT_ID,
  SEED_NEXT_REGISTRATION_ID,
} = require('../data/seedEvents');

class EventRepository {
  constructor(storage) {
    this.storage = storage;
    this.events = [];
    this.nextEventId = 1;
    this.nextRegistrationId = 1;
  }

  init() {
    const saved = this.storage.load();
    if (saved) {
      this.restore(saved);
      return;
    }
    this.restore({
      events: structuredClone(SEED_EVENTS),
      nextEventId: SEED_NEXT_EVENT_ID,
      nextRegistrationId: SEED_NEXT_REGISTRATION_ID,
    });
    this.persist();
  }

  restore({ events, nextEventId, nextRegistrationId }) {
    if (!Array.isArray(events)) throw new Error('Файл данных повреждён: events должен быть массивом');
    this.events = events;
    this.nextEventId = nextEventId;
    this.nextRegistrationId = nextRegistrationId;
  }

  persist() {
    this.storage.save({
      nextEventId: this.nextEventId,
      nextRegistrationId: this.nextRegistrationId,
      events: this.events,
    });
  }

  findAll() {
    return this.events;
  }

  findById(id) {
    return this.events.find((event) => event.id === id);
  }

  createEvent(fields) {
    const event = { id: this.nextEventId++, ...fields, registrations: [] };
    this.events.push(event);
    this.persist();
    return event;
  }

  updateEvent(event, fields) {
    Object.assign(event, fields);
    this.persist();
    return event;
  }

  deleteEvent(event) {
    this.events.splice(this.events.indexOf(event), 1);
    this.persist();
    return event;
  }

  addRegistration(event, { name, email }) {
    const registration = { id: this.nextRegistrationId++, name, email };
    event.registrations.push(registration);
    this.persist();
    return registration;
  }

  removeRegistration(event, registration) {
    event.registrations.splice(event.registrations.indexOf(registration), 1);
    this.persist();
    return registration;
  }

  moveRegistration(source, registration, target) {
    source.registrations.splice(source.registrations.indexOf(registration), 1);
    target.registrations.push(registration);
    this.persist();
    return registration;
  }
}

module.exports = EventRepository;
