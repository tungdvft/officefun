// numerology-calculations.js
const NumerologyUtils = {
  reduceToSingleDigit: (number) => {
    if ([11, 22, 33].includes(number)) return number; // Giữ nguyên Master Numbers
    let sum = number;
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return sum || 1;
  }
};

const PYTHAGOREAN_CHART = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  á: 1, à: 1, ả: 1, ã: 1, ạ: 1,
  ă: 1, ắ: 1, ằ: 1, ẳ: 1, ẵ: 1, ặ: 1,
  â: 1, ấ: 1, ầ: 1, ẩ: 1, ẫ: 1, ậ: 1,
  đ: 4,
  é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5,
  ê: 5, ế: 5, ề: 5, ể: 5, ễ: 5, ệ: 5,
  í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9,
  ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6,
  ô: 6, ố: 6, ồ: 6, ổ: 6, ỗ: 6, ộ: 6,
  ơ: 6, ớ: 6, ờ: 6, ở: 6, ỡ: 6, ợ: 6,
  ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3,
  ư: 3, ứ: 3, ừ: 3, ử: 3, ữ: 3, ự: 3,
  ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7
};

const VOWELS = {
  a: 1, e: 5, i: 9, o: 6, u: 3,
  á: 1, à: 1, ả: 1, ã: 1, ạ: 1,
  ă: 1, ắ: 1, ằ: 1, ẳ: 1, ẵ: 1, ặ: 1,
  â: 1, ấ: 1, ầ: 1, ẩ: 1, ẫ: 1, ậ: 1,
  é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5,
  ê: 5, ế: 5, ề: 5, ể: 5, ễ: 5, ệ: 5,
  í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9,
  ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6,
  ô: 6, ố: 6, ồ: 6, ổ: 6, ỗ: 6, ộ: 6,
  ơ: 6, ớ: 6, ờ: 6, ở: 6, ỡ: 6, ợ: 6,
  ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3,
  ư: 3, ứ: 3, ừ: 3, ử: 3, ữ: 3, ự: 3,
  ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7
};

// 1. Số Đường đời (Life Path Number) - Hoàn thiện
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  const [day, month, year] = birthDate.split('/').map(Number);
  
  // Validate date
  const dateObj = new Date(year, month-1, day);
  if (dateObj.getDate() !== day || dateObj.getMonth()+1 !== month) {
    throw new Error('Invalid date');
  }

  const reduceWithMaster = num => {
    if ([11, 22, 33].includes(num)) return num;
    return NumerologyUtils.reduceToSingleDigit(num);
  };

  const reducedDay = reduceWithMaster(day);
  const reducedMonth = reduceWithMaster(month);
  const reducedYear = reduceWithMaster(
    year.toString().split('').reduce((a, b) => a + parseInt(b), 0)
  );

  return reduceWithMaster(reducedDay + reducedMonth + reducedYear);
}

// 2. Số Vận mệnh (Expression Number) - Cải tiến
function calculateExpressionNumber(name) {
  if (!name || typeof name !== 'string') return 1;
  
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const sum = cleanName.split('').reduce((acc, char) => {
    return acc + (PYTHAGOREAN_CHART[char] || 0);
  }, 0);
  
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 3. Số Linh hồn (Soul Urge Number) - Cải tiến
function calculateSoulUrgeNumber(name) {
  if (!name || typeof name !== 'string') return 1;
  
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const sum = cleanName.split('').reduce((acc, char) => {
    return acc + (VOWELS[char] || 0);
  }, 0);
  
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 4. Số Nhân cách (Personality Number) - Cải tiến
function calculatePersonalityNumber(name) {
  if (!name || typeof name !== 'string') return 1;
  
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const sum = cleanName.split('').reduce((acc, char) => {
    return acc + (VOWELS[char] ? 0 : (PYTHAGOREAN_CHART[char] || 0));
  }, 0);
  
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 5. Số Thái độ (Attitude Number) - Hoàn thiện
function calculateAttitudeNumber(birthDate) {
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const birthDay = calculateBirthDayNumber(birthDate);
    return NumerologyUtils.reduceToSingleDigit(lifePath + birthDay);
  } catch {
    return 1;
  }
}

// 6. Số Ngày sinh (Birth Day Number) - Hoàn thiện
function calculateBirthDayNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  
  const day = parseInt(birthDate.split('/')[0]);
  if (day < 1 || day > 31) return 1;
  
  if ([11, 22].includes(day)) return day;
  return NumerologyUtils.reduceToSingleDigit(day);
}

// 7. Số Năm cá nhân (Personal Year Number) - Hoàn thiện
function calculatePersonalYearNumber(birthDate) {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const [day, month] = birthDate.split('/').map(Number);
    
    // Adjust for birthdays not yet occurred this year
    const birthdayPassed = (today.getMonth() > month-1) || 
                         (today.getMonth() === month-1 && today.getDate() >= day);
    const effectiveYear = birthdayPassed ? year : year - 1;
    
    const sum = day + month + effectiveYear;
    return NumerologyUtils.reduceToSingleDigit(sum);
  } catch {
    return 1;
  }
}

// 8. Số Tháng cá nhân (Personal Month Number) - Hoàn thiện
function calculatePersonalMonthNumber(birthDate) {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const personalYear = calculatePersonalYearNumber(birthDate);
    return NumerologyUtils.reduceToSingleDigit(personalYear + month);
  } catch {
    return 1;
  }
}

// 9. Số Ngày cá nhân (Personal Day Number) - Hoàn thiện
function calculatePersonalDayNumber(birthDate) {
  try {
    const today = new Date();
    const day = today.getDate();
    const personalMonth = calculatePersonalMonthNumber(birthDate);
    return NumerologyUtils.reduceToSingleDigit(personalMonth + day);
  } catch {
    return 1;
  }
}

// 10. Số Sứ mệnh (Mission Number) - Giữ nguyên
function calculateMissionNumber(name) {
  return calculateExpressionNumber(name);
}

// 11. Số Thử thách (Challenge Number) - Hoàn thiện
function calculateChallengeNumber(birthDate) {
  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const yearSum = NumerologyUtils.reduceToSingleDigit(year);
    
    const firstChallenge = Math.abs(day - month);
    const secondChallenge = Math.abs(month - yearSum);
    const thirdChallenge = Math.abs(firstChallenge - secondChallenge);
    
    return NumerologyUtils.reduceToSingleDigit(thirdChallenge);
  } catch {
    return 1;
  }
}

// 12. Số Thế hệ (Generation Number) - Hoàn thiện
function calculateGenerationNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  
  const year = birthDate.split('/')[2];
  const sum = year.split('').reduce((a, b) => a + parseInt(b), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 13. Số Cân bằng (Balance Number) - Hoàn thiện
function calculateBalanceNumber(name) {
  if (!name || typeof name !== 'string') return 1;
  
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const initials = cleanName.split(/\s+/).map(word => word[0]).filter(Boolean);
  
  if (initials.length === 0) return 1;
  
  const sum = initials.reduce((acc, char) => acc + (PYTHAGOREAN_CHART[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum);
}

// 14. Số Sáng tạo (Creative Number) - Hoàn thiện
function calculateCreativeNumber(birthDate, name) {
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    const soulUrge = calculateSoulUrgeNumber(name);
    
    return [lifePath, expression, soulUrge].filter(num => [1, 3, 5].includes(num)).length;
  } catch {
    return 0;
  }
}

// 15. Số Trưởng thành (Maturity Number) - Hoàn thiện
function calculateMaturityNumber(birthDate, name) {
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    return NumerologyUtils.reduceToSingleDigit(lifePath + expression);
  } catch {
    return 1;
  }
}

// 16. Số Năng lượng (Power Number) - Hoàn thiện
function calculatePowerNumber(birthDate, name) {
  return calculateMaturityNumber(birthDate, name);
}

// 17. Số Tiềm thức (Subconscious Self Number) - Hoàn thiện
function calculateSubconsciousSelfNumber(name) {
  if (!name || typeof name !== 'string') return 1;
  
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const uniqueNumbers = new Set(
    cleanName.split('').map(char => PYTHAGOREAN_CHART[char] || 0).filter(n => n > 0)
  );
  
  return uniqueNumbers.size || 1;
}
// 18. Tính 4 đỉnh cao đời người
function calculatePeakNumbers(birthDate) {
  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const lifePath = calculateLifePathNumber(birthDate);
    
    // Đỉnh 1: Tháng sinh + Ngày sinh
    const peak1 = NumerologyUtils.reduceToSingleDigit(month + day);
    
    // Đỉnh 2: Ngày sinh + Năm sinh
    const peak2 = NumerologyUtils.reduceToSingleDigit(day + year);
    
    // Đỉnh 3: Đỉnh 1 + Đỉnh 2
    const peak3 = NumerologyUtils.reduceToSingleDigit(peak1 + peak2);
    
    // Đỉnh 4: Tháng sinh + Năm sinh
    const peak4 = NumerologyUtils.reduceToSingleDigit(month + year);
    
    return {
      firstPeak: peak1,  // ~36 tuổi
      secondPeak: peak2, // ~45 tuổi
      thirdPeak: peak3,  // ~54 tuổi
      fourthPeak: peak4  // ~63 tuổi
    };
  } catch {
    return { firstPeak: 1, secondPeak: 1, thirdPeak: 1, fourthPeak: 1 };
  }
}
// 19. Thử thách ẩn (từ tên)
function calculateHiddenChallengeNumbers(name) {
  try {
    const expression = calculateExpressionNumber(name);
    const soulUrge = calculateSoulUrgeNumber(name);
    const personality = calculatePersonalityNumber(name);
    
    return {
      challenge1: Math.abs(expression - soulUrge),
      challenge2: Math.abs(soulUrge - personality),
      challenge3: Math.abs(personality - expression),
      ultimateChallenge: NumerologyUtils.reduceToSingleDigit(
        Math.abs(expression - soulUrge) + 
        Math.abs(soulUrge - personality) + 
        Math.abs(personality - expression)
      )
    };
  } catch {
    return { challenge1: 1, challenge2: 1, challenge3: 1, ultimateChallenge: 1 };
  }
}
// 20. 3 trụ cột chính
function calculateCoreNumbers(birthDate, name) {
  return {
    lifePath: calculateLifePathNumber(birthDate),       // Sứ mệnh
    expression: calculateExpressionNumber(name),        // Tài năng
    soulUrge: calculateSoulUrgeNumber(name)            // Động lực
  };
}
// 21. Kiểm tra số Nghiệp
function checkKarmicNumbers(birthDate, name) {
  const hasKarmicDebt = (number) => [13, 14, 16, 19].includes(number);
  
  return {
    inLifePath: hasKarmicDebt(calculateLifePathNumber(birthDate)),
    inExpression: hasKarmicDebt(calculateExpressionNumber(name)),
    inBirthday: hasKarmicDebt(calculateBirthDayNumber(birthDate)),
    inPeaks: Object.values(calculatePeakNumbers(birthDate)).some(hasKarmicDebt)
  };
}
// 22. 5 góc của ngũ giác số
function calculatePentagonNumbers(birthDate, name) {
  return {
    physical: calculateBirthDayNumber(birthDate),      // Thể chất
    mental: calculatePersonalityNumber(name),          // Tinh thần
    emotional: calculateSoulUrgeNumber(name),          // Cảm xúc
    intuitive: calculateChallengeNumber(birthDate),    // Trực giác
    spiritual: calculateLifePathNumber(birthDate)      // Tâm linh
  };
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
  NumerologyUtils,
  calculatePeakNumbers,
  calculateHiddenChallengeNumbers,
  calculateCoreNumbers,
  checkKarmicNumbers,
  calculatePentagonNumbers
};