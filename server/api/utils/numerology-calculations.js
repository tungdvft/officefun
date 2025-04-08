// numerology-calculations.js
const NumerologyUtils = {
  reduceToSingleDigit: (number) => {
    let sum = number;
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return sum || 1;
  }
};

// Bảng Pythagoras để chuyển chữ cái thành số
const PYTHAGOREAN_CHART = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

// Bảng nguyên âm cho Số Linh hồn
const VOWELS = { a: 1, e: 5, i: 9, o: 6, u: 3 };

// 1. Số Đường đời (Life Path Number)
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 2. Số Vận mệnh (Expression/Destiny Number)
function calculateExpressionNumber(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => acc + (PYTHAGOREAN_CHART[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 3. Số Linh hồn (Soul Urge Number)
function calculateSoulUrgeNumber(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => acc + (VOWELS[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 4. Số Nhân cách (Personality Number)
function calculatePersonalityNumber(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => acc + (VOWELS[char] ? 0 : PYTHAGOREAN_CHART[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 5. Số Thái độ (Attitude Number)
function calculateAttitudeNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [day, month] = birthDate.split('/').map(Number);
  const sum = day + month;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 6. Số Ngày sinh (Birth Day Number)
function calculateBirthDayNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const day = parseInt(birthDate.split('/')[0]);
  return day > 9 ? NumerologyUtils.reduceToSingleDigit(day) : day;
}

// 7. Số Năm cá nhân (Personal Year Number)
function calculatePersonalYearNumber(birthDate) {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const year = today.getFullYear();
  const [day, month] = birthDate.split('/').map(Number);
  const sum = day + month + year;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 8. Số Tháng cá nhân (Personal Month Number)
function calculatePersonalMonthNumber(birthDate) {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const month = today.getMonth() + 1;
  const personalYear = calculatePersonalYearNumber(birthDate);
  const sum = personalYear + month;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 9. Số Ngày cá nhân (Personal Day Number)
function calculatePersonalDayNumber(birthDate) {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const personalMonth = calculatePersonalMonthNumber(birthDate);
  const sum = personalMonth + day;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 10. Số Sứ mệnh (Mission Number) - Thường trùng với Số Vận mệnh
function calculateMissionNumber(name) {
  return calculateExpressionNumber(name);
}

// 11. Số Thử thách (Challenge Number)
function calculateChallengeNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [day, month, year] = birthDate.split('/').map(Number);
  const yearSum = NumerologyUtils.reduceToSingleDigit(year);
  const diff1 = Math.abs(day - month);
  const diff2 = Math.abs(month - yearSum);
  const diff3 = Math.abs(diff1 - diff2);
  return NumerologyUtils.reduceToSingleDigit(diff3);
}

// 12. Số Thế hệ (Generation Number)
function calculateGenerationNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const year = parseInt(birthDate.split('/')[2]);
  const sum = year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 13. Số Cân bằng (Balance Number)
function calculateBalanceNumber(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const initials = cleanName.split(/\s+/).map(word => word[0]);
  const sum = initials.reduce((acc, char) => acc + (PYTHAGOREAN_CHART[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 14. Số Sáng tạo (Creative Number) - Dựa trên số lần xuất hiện của 1, 3, 5 trong biểu đồ
function calculateCreativeNumber(birthDate, name) {
  const lifePath = calculateLifePathNumber(birthDate);
  const expression = calculateExpressionNumber(name);
  const soulUrge = calculateSoulUrgeNumber(name);
  const count = [lifePath, expression, soulUrge].filter(num => [1, 3, 5].includes(num)).length;
  return count;
}

// 15. Số Trưởng thành (Maturity Number)
function calculateMaturityNumber(birthDate, name) {
  const lifePath = calculateLifePathNumber(birthDate);
  const expression = calculateExpressionNumber(name);
  const sum = lifePath + expression;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 16. Số Năng lượng (Power Number) - Tổng hợp Đường đời và Vận mệnh
function calculatePowerNumber(birthDate, name) {
  const lifePath = calculateLifePathNumber(birthDate);
  const expression = calculateExpressionNumber(name);
  const sum = lifePath + expression;
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 17. Số Tiềm thức (Subconscious Self Number)
function calculateSubconsciousSelfNumber(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const uniqueNumbers = new Set(cleanName.split('').map(char => PYTHAGOREAN_CHART[char] || 0));
  return uniqueNumbers.size;
}

export {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateAttitudeNumber,
  calculateBirthDayNumber,
  calculatePersonalYearNumber,
  calculatePersonalMonthNumber,
  calculatePersonalDayNumber,
  calculateMissionNumber,
  calculateChallengeNumber,
  calculateGenerationNumber,
  calculateBalanceNumber,
  calculateCreativeNumber,
  calculateMaturityNumber,
  calculatePowerNumber,
  calculateSubconsciousSelfNumber,
  NumerologyUtils
};