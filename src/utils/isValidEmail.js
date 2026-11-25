const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => typeof value === 'string' && EMAIL_PATTERN.test(value);

module.exports = isValidEmail;
