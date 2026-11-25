const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

module.exports = isNonEmptyString;
