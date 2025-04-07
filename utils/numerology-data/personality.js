const { calculateFromText } = require('./calculations');
const alphabetMap = require('./alphabetMap');

function getPersonalityNumber(fullName) {
  const vowels = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y'];
  const cleanedText = fullName.toLowerCase().replace(/[^a-zăâđêôơư]/g, '');
  let total = 0;
  for (let char of cleanedText) {
    if (!vowels.includes(char)) {
      total += alphabetMap[char];
    }
  }
  return reduceToSingleDigit(total);
}

module.exports = { getPersonalityNumber };