const { calculateFromText } = require('./calculations');
const alphabetMap = require('./alphabetMap');

function getExpressionNumber(fullName) {
  return calculateFromText(fullName, alphabetMap);
}

module.exports = { getExpressionNumber };