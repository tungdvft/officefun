function getPinnacleNumbers(birthDate) {
  const [day, month, year] = birthDate.split('/').map(Number);
  const dayNum = reduceToSingleDigit(day);
  const monthNum = reduceToSingleDigit(month);
  const yearNum = reduceToSingleDigit(year);

  const firstPinnacle = reduceToSingleDigit(dayNum + monthNum);
  const secondPinnacle = reduceToSingleDigit(dayNum + yearNum);
  const thirdPinnacle = reduceToSingleDigit(firstPinnacle + secondPinnacle);
  const fourthPinnacle = reduceToSingleDigit(monthNum + yearNum);

  return [firstPinnacle, secondPinnacle, thirdPinnacle, fourthPinnacle];
}

module.exports = { getPinnacleNumbers };