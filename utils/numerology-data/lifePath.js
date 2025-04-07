const { calculateFromDate } = require('./calculations');

function getLifePathNumber(birthDate) {
  // birthDate format: "DD/MM/YYYY"
  return calculateFromDate(birthDate);
}

module.exports = { getLifePathNumber };