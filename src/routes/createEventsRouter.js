const { Router } = require('express');

const createEventsRouter = (service) => {
  const router = Router();

  router.get('/', ({ query }, res) => res.status(200).json(service.listEvents(query)));

  router.post('/', ({ body }, res) => res.status(201).json(service.createEvent(body)));

  router.get('/:id', ({ params }, res) => res.status(200).json(service.getEvent(params.id)));

  router.put('/:id', ({ params, body }, res) =>
    res.status(200).json(service.updateEvent(params.id, body)),
  );

  router.delete('/:id', ({ params }, res) =>
    res.status(200).json(service.deleteEvent(params.id)),
  );

  router.get('/:id/registrations', ({ params }, res) =>
    res.status(200).json(service.listRegistrations(params.id)),
  );

  router.post('/:id/registrations', ({ params, body }, res) =>
    res.status(201).json(service.register(params.id, body)),
  );

  router.delete('/:id/registrations/:registrationId', ({ params }, res) =>
    res.status(200).json(service.cancelRegistration(params.id, params.registrationId)),
  );

  router.post('/:id/registrations/:registrationId/transfer', ({ params, body }, res) =>
    res.status(200).json(service.transferRegistration(params.id, params.registrationId, body)),
  );

  return router;
};

module.exports = createEventsRouter;
