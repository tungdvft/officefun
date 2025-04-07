const { calculateFromDate } = require('./calculations');

function getPersonalYearNumber(birthDate, currentYear) {
  const lifePath = calculateFromDate(birthDate);
  const yearNumber = calculateFromDate(currentYear.toString());
  return reduceToSingleDigit(lifePath + yearNumber);
}

module.exports = { getPersonalYearNumber };