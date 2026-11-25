const requestLogger = ({ method, originalUrl }, res, next) => {
  res.on('finish', () =>
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode}`),
  );
  next();
};

module.exports = requestLogger;
