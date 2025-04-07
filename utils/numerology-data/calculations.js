function reduceToSingleDigit(number) {
  while (number > 9 && number !== 11 && number !== 22 && number !== 33) {
    number = number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return number;
}

function calculateFromText(text, alphabetMap) {
  const cleanedText = text.toLowerCase().replace(/[^a-zăâđêôơư]/g, '');
  let total = 0;
  for (let char of cleanedText) {
    total += alphabetMap[char] || 0;
  }
  return reduceToSingleDigit(total);
}

function calculateFromDate(dateString) {
  const cleanedDate = dateString.replace(/[^0-9]/g, '');
  let total = 0;
  for (let digit of cleanedDate) {
    total += parseInt(digit);
  }
  return reduceToSingleDigit(total);
}

module.exports = { reduceToSingleDigit, calculateFromText, calculateFromDate };