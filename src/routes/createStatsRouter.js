const { Router } = require('express');

const createStatsRouter = (service) => {
  const router = Router();

  router.get('/', (req, res) => res.status(200).json(service.getStats()));

  return router;
};

module.exports = createStatsRouter;
