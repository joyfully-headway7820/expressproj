const HttpError = require('../errors/HttpError');
const parseId = require('../utils/parseId');
const freeSeats = require('../utils/freeSeats');
const sortEvents = require('../utils/sortEvents');
const serializeEvent = require('../utils/serializeEvent');
const buildStats = require('../utils/buildStats');
const parseListQuery = require('../validation/parseListQuery');
const validateEventPayload = require('../validation/validateEventPayload');
const validateRegistrationPayload = require('../validation/validateRegistrationPayload');
const validateTransferPayload = require('../validation/validateTransferPayload');

const sameEmail = (a, b) => a.toLowerCase() === b.toLowerCase();

class EventService {
  constructor(repository) {
    this.repository = repository;
  }

  listEvents(query) {
    const { category, available, sort, order } = parseListQuery(query);

    const filtered = this.repository.findAll().filter((event) => {
      if (category && event.category.toLowerCase() !== category.toLowerCase()) return false;
      if (available !== undefined && (freeSeats(event) > 0) !== available) return false;
      return true;
    });

    return sortEvents(filtered, sort, order).map(serializeEvent);
  }

  getEvent(rawId) {
    return serializeEvent(this.requireEvent(rawId));
  }

  createEvent(body) {
    return serializeEvent(this.repository.createEvent(validateEventPayload(body)));
  }

  updateEvent(rawId, body) {
    const event = this.requireEvent(rawId);
    const fields = validateEventPayload(body);

    if (fields.capacity < event.registrations.length)
      throw HttpError.conflict(
        `Нельзя уменьшить вместимость до ${fields.capacity}: на мероприятие уже зарегистрировано ${event.registrations.length}`,
      );

    return serializeEvent(this.repository.updateEvent(event, fields));
  }

  deleteEvent(rawId) {
    const event = this.requireEvent(rawId);
    if (event.registrations.length)
      throw HttpError.conflict('Нельзя удалить мероприятие, на которое есть активные регистрации');

    return serializeEvent(this.repository.deleteEvent(event));
  }

  listRegistrations(rawId) {
    return this.requireEvent(rawId).registrations;
  }

  register(rawId, body) {
    const event = this.requireEvent(rawId);
    const participant = validateRegistrationPayload(body);

    this.assertCanAccept(event, participant.email);

    return this.repository.addRegistration(event, participant);
  }

  cancelRegistration(rawEventId, rawRegistrationId) {
    const event = this.requireEvent(rawEventId);
    const registration = this.requireRegistration(event, rawRegistrationId);

    return this.repository.removeRegistration(event, registration);
  }

  transferRegistration(rawEventId, rawRegistrationId, body) {
    const source = this.requireEvent(rawEventId);
    const registration = this.requireRegistration(source, rawRegistrationId);
    const { targetEventId } = validateTransferPayload(body);

    const target = this.repository.findById(targetEventId);
    if (!target) throw HttpError.notFound(`Целевое мероприятие ${targetEventId} не найдено`);
    if (target === source)
      throw HttpError.badRequest('Целевое мероприятие совпадает с текущим');

    this.assertCanAccept(target, registration.email);

    this.repository.moveRegistration(source, registration, target);
    return { registration, from: serializeEvent(source), to: serializeEvent(target) };
  }

  getStats() {
    return buildStats(this.repository.findAll());
  }

  assertCanAccept(event, email) {
    if (freeSeats(event) < 1)
      throw HttpError.conflict(`На мероприятии «${event.title}» нет свободных мест`);
    if (event.registrations.some((registration) => sameEmail(registration.email, email)))
      throw HttpError.conflict(`Участник с email ${email} уже зарегистрирован на это мероприятие`);
  }

  requireEvent(rawId) {
    const event = this.repository.findById(parseId(rawId));
    if (!event) throw HttpError.notFound(`Мероприятие ${rawId} не найдено`);
    return event;
  }

  requireRegistration(event, rawRegistrationId) {
    const id = parseId(rawRegistrationId);
    const registration = event.registrations.find((item) => item.id === id);
    if (!registration)
      throw HttpError.notFound(
        `Регистрация ${rawRegistrationId} на мероприятии ${event.id} не найдена`,
      );
    return registration;
  }
}

module.exports = EventService;
