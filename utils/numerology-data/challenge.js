function getChallengeNumbers(birthDate) {
  const [day, month, year] = birthDate.split('/').map(Number);
  const dayNum = reduceToSingleDigit(day);
  const monthNum = reduceToSingleDigit(month);
  const yearNum = reduceToSingleDigit(year);

  const firstChallenge = Math.abs(dayNum - monthNum);
  const secondChallenge = Math.abs(dayNum - yearNum);
  const thirdChallenge = Math.abs(firstChallenge - secondChallenge);

  return [firstChallenge, secondChallenge, thirdChallenge];
}

module.exports = { getChallengeNumbers };