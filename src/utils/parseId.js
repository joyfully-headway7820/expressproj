const parseId = (value) => (/^\d+$/.test(value) ? Number(value) : null);

module.exports = parseId;
