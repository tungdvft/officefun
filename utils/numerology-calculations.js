const NumerologyUtils = {
  reduceToSingleDigit: (number, forceReduce = false) => {
    console.log(`[reduceToSingleDigit] Input: number=${number}, forceReduce=${forceReduce}`);
    if (!forceReduce && [11, 22, 33].includes(number)) {
      console.log(`[reduceToSingleDigit] Keeping Master Number: ${number}`);
      return number;
    }
    let sum = number;
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    const result = sum || 1;
    console.log(`[reduceToSingleDigit] Output: ${result}`);
    return result;
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

// 1. Số Đường đời (Life Path Number)
function calculateLifePathNumber(birthDate) {
  console.log(`[calculateLifePathNumber] Input: birthDate=${birthDate}`);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculateLifePathNumber] Invalid date format');
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    console.log('[calculateLifePathNumber] Parsed date:', { day, month, year });

    if (dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month) {
      console.warn('[calculateLifePathNumber] Invalid date');
      throw new Error('Invalid date');
    }

    const reduceWithMaster = num => {
      if ([11, 22, 33].includes(num)) {
        console.log(`[calculateLifePathNumber] Keeping Master Number: ${num}`);
        return num;
      }
      return NumerologyUtils.reduceToSingleDigit(num);
    };

    const reducedDay = reduceWithMaster(day);
    const reducedMonth = reduceWithMaster(month);
    const reducedYear = reduceWithMaster(
      year.toString().split('').reduce((a, b) => a + parseInt(b), 0)
    );

    const result = reduceWithMaster(reducedDay + reducedMonth + reducedYear);
    console.log(`[calculateLifePathNumber] Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateLifePathNumber] Error: ${error.message}`);
    throw error;
  }
}

// 2. Số Vận mệnh (Expression Number)
function calculateExpressionNumber(name) {
  console.log(`[calculateExpressionNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateExpressionNumber] Invalid name, returning 1');
    return 1;
  }

  const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => {
    const value = PYTHAGOREAN_CHART[char] || 0;
    console.log(`[calculateExpressionNumber] Char: ${char}, Value: ${value}`);
    return acc + value;
  }, 0);

  const result = NumerologyUtils.reduceToSingleDigit(sum);
  console.log(`[calculateExpressionNumber] Sum: ${sum}, Output: ${result}`);
  return result;
}

// 3. Số Linh hồn (Soul Urge Number)
function calculateSoulUrgeNumber(name) {
  console.log(`[calculateSoulUrgeNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateSoulUrgeNumber] Invalid name, returning 1');
    return 1;
  }

  const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => {
    const value = VOWELS[char] || 0;
    console.log(`[calculateSoulUrgeNumber] Char: ${char}, Value: ${value}`);
    return acc + value;
  }, 0);

  const result = NumerologyUtils.reduceToSingleDigit(sum);
  console.log(`[calculateSoulUrgeNumber] Sum: ${sum}, Output: ${result}`);
  return result;
}

// 4. Số Nhân cách (Personality Number)
function calculatePersonalityNumber(name) {
  console.log(`[calculatePersonalityNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculatePersonalityNumber] Invalid name, returning 1');
    return 1;
  }

  const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
  const consonants = cleanName.split('').filter(char => !Object.keys(VOWELS).includes(char));
  console.log(`[calculatePersonalityNumber] Consonants: ${consonants}`);

  if (consonants.length === 0) {
    console.warn('[calculatePersonalityNumber] No consonants, returning 1');
    return 1;
  }

  const sum = consonants.reduce((acc, char) => {
    const value = PYTHAGOREAN_CHART[char] || 0;
    console.log(`[calculatePersonalityNumber] Char: ${char}, Value: ${value}`);
    return acc + value;
  }, 0);

  const result = sum > 0 ? NumerologyUtils.reduceToSingleDigit(sum, true) : 1;
  console.log(`[calculatePersonalityNumber] Sum: ${sum}, Output: ${result}`);
  return result;
}

// 5. Số Thái độ (Attitude Number)
function calculateAttitudeNumber(birthDate) {
  console.log(`[calculateAttitudeNumber] Input: birthDate=${birthDate}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const birthDay = calculateBirthDayNumber(birthDate);
    const result = NumerologyUtils.reduceToSingleDigit(lifePath + birthDay);
    console.log(`[calculateAttitudeNumber] LifePath: ${lifePath}, BirthDay: ${birthDay}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateAttitudeNumber] Error: ${error.message}`);
    return 1;
  }
}

// 6. Số Ngày sinh (Birth Day Number)
function calculateBirthDayNumber(birthDate) {
  console.log(`[calculateBirthDayNumber] Input: birthDate=${birthDate}`);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculateBirthDayNumber] Invalid date format, returning 1');
    return 1;
  }

  const day = parseInt(birthDate.split('/')[0]);
  if (day < 1 || day > 31) {
    console.warn('[calculateBirthDayNumber] Invalid day, returning 1');
    return 1;
  }

  const result = [11, 22].includes(day) ? day : NumerologyUtils.reduceToSingleDigit(day);
  console.log(`[calculateBirthDayNumber] Day: ${day}, Output: ${result}`);
  return result;
}

// 7. Số Năm cá nhân (Personal Year Number)
function calculatePersonalYearNumber(birthDate, targetYear) {
  console.log(`[calculatePersonalYearNumber] Input: birthDate=${birthDate}, targetYear=${targetYear}`);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculatePersonalYearNumber] Invalid date format');
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  try {
    const [day, month] = birthDate.split('/').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      console.warn('[calculatePersonalYearNumber] Invalid day or month');
      throw new Error('Invalid day or month');
    }

    const yearDigits = targetYear.toString().split('').map(Number);
    const dayDigits = day.toString().split('').map(Number);
    const monthDigits = month.toString().split('').map(Number);
    const allDigits = [...dayDigits, ...monthDigits, ...yearDigits];
    const sum = allDigits.reduce((acc, digit) => acc + digit, 0);

    console.log(`[calculatePersonalYearNumber] Digits: ${allDigits}, Sum: ${sum}`);

    let personalYear = NumerologyUtils.reduceToSingleDigit(sum);
    if (personalYear === 0) {
      console.warn('[calculatePersonalYearNumber] Personal year calculated as 0, returning 1');
      personalYear = 1;
    }

    console.log(`[calculatePersonalYearNumber] Output: ${personalYear}`);
    return personalYear;
  } catch (error) {
    console.error(`[calculatePersonalYearNumber] Error: ${error.message}`);
    throw error;
  }
}

// 8. Số Tháng cá nhân (Personal Month Number)
function calculatePersonalMonthNumber(birthDate) {
  console.log(`[calculatePersonalMonthNumber] Input: birthDate=${birthDate}`);
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const personalYear = calculatePersonalYearNumber(birthDate, today.getFullYear());
    const result = NumerologyUtils.reduceToSingleDigit(personalYear + month);
    console.log(`[calculatePersonalMonthNumber] Month: ${month}, PersonalYear: ${personalYear}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculatePersonalMonthNumber] Error: ${error.message}`);
    return 1;
  }
}

// 9. Số Ngày cá nhân (Personal Day Number)
function calculatePersonalDayNumber(birthDate) {
  console.log(`[calculatePersonalDayNumber] Input: birthDate=${birthDate}`);
  try {
    const today = new Date();
    const day = today.getDate();
    const personalMonth = calculatePersonalMonthNumber(birthDate);
    const result = NumerologyUtils.reduceToSingleDigit(personalMonth + day);
    console.log(`[calculatePersonalDayNumber] Day: ${day}, PersonalMonth: ${personalMonth}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculatePersonalDayNumber] Error: ${error.message}`);
    return 1;
  }
}

// 10. Số Sứ mệnh (Mission Number)
function calculateMissionNumber(name) {
  console.log(`[calculateMissionNumber] Input: name=${name}`);
  const result = calculateExpressionNumber(name);
  console.log(`[calculateMissionNumber] Output: ${result}`);
  return result;
}

// 11. Số Thử thách (Challenge Number)
function calculateChallengeNumber(birthDate) {
  console.log(`[calculateChallengeNumber] Input: birthDate=${birthDate}`);
  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const yearSum = NumerologyUtils.reduceToSingleDigit(year);

    const firstChallenge = Math.abs(day - month);
    const secondChallenge = Math.abs(month - yearSum);
    const thirdChallenge = Math.abs(firstChallenge - secondChallenge);

    const result = NumerologyUtils.reduceToSingleDigit(thirdChallenge);
    console.log(`[calculateChallengeNumber] First: ${firstChallenge}, Second: ${secondChallenge}, Third: ${thirdChallenge}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateChallengeNumber] Error: ${error.message}`);
    return 1;
  }
}

// 12. Số Thế hệ (Generation Number)
function calculateGenerationNumber(birthDate) {
  console.log(`[calculateGenerationNumber] Input: birthDate=${birthDate}`);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculateGenerationNumber] Invalid date format, returning 1');
    return 1;
  }

  const year = birthDate.split('/')[2];
  const sum = year.split('').reduce((a, b) => a + parseInt(b), 0);
  const result = NumerologyUtils.reduceToSingleDigit(sum);
  console.log(`[calculateGenerationNumber] Year: ${year}, Sum: ${sum}, Output: ${result}`);
  return result;
}

// 13. Số Cân bằng (Balance Number)
function calculateBalanceNumber(name) {
  console.log(`[calculateBalanceNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateBalanceNumber] Invalid name, returning 1');
    return 1;
  }

  const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
  const initials = cleanName.split(/\s+/).map(word => word[0]).filter(Boolean);

  if (initials.length === 0) {
    console.warn('[calculateBalanceNumber] No initials, returning 1');
    return 1;
  }

  const sum = initials.reduce((acc, char) => {
    const value = PYTHAGOREAN_CHART[char] || 0;
    console.log(`[calculateBalanceNumber] Initial: ${char}, Value: ${value}`);
    return acc + value;
  }, 0);

  const result = NumerologyUtils.reduceToSingleDigit(sum);
  console.log(`[calculateBalanceNumber] Sum: ${sum}, Output: ${result}`);
  return result;
}

// 14. Số Sáng tạo (Creative Number)
function calculateCreativeNumber(birthDate, name) {
  console.log(`[calculateCreativeNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    const soulUrge = calculateSoulUrgeNumber(name);

    const result = [lifePath, expression, soulUrge].filter(num => [1, 3, 5].includes(num)).length;
    console.log(`[calculateCreativeNumber] LifePath: ${lifePath}, Expression: ${expression}, SoulUrge: ${soulUrge}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateCreativeNumber] Error: ${error.message}`);
    return 0;
  }
}

// 15. Số Trưởng thành (Maturity Number)
function calculateMaturityNumber(birthDate, name) {
  console.log(`[calculateMaturityNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    const result = NumerologyUtils.reduceToSingleDigit(lifePath + expression);
    console.log(`[calculateMaturityNumber] LifePath: ${lifePath}, Expression: ${expression}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateMaturityNumber] Error: ${error.message}`);
    return 1;
  }
}

// 16. Số Năng lượng (Power Number)
function calculatePowerNumber(birthDate, name) {
  console.log(`[calculatePowerNumber] Input: birthDate=${birthDate}, name=${name}`);
  const result = calculateMaturityNumber(birthDate, name);
  console.log(`[calculatePowerNumber] Output: ${result}`);
  return result;
}

// 17. Số Năng lực Trưởng thành (Mature Power Number)
function calculateMaturePowerNumber(birthDate, name) {
  console.log(`[calculateMaturePowerNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    const soulUrge = calculateSoulUrgeNumber(name);
    const sum = lifePath + expression + soulUrge;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateMaturePowerNumber] LifePath: ${lifePath}, Expression: ${expression}, SoulUrge: ${soulUrge}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateMaturePowerNumber] Error: ${error.message}`);
    return 1;
  }
}

// 18. Số Tiềm thức (Subconscious Self Number)
function calculateSubconsciousSelfNumber(name) {
  console.log(`[calculateSubconsciousSelfNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateSubconsciousSelfNumber] Invalid name, returning 1');
    return 1;
  }

  const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
  const uniqueNumbers = new Set(
    cleanName.split('').map(char => PYTHAGOREAN_CHART[char] || 0).filter(n => n > 0)
  );

  const result = uniqueNumbers.size || 1;
  console.log(`[calculateSubconsciousSelfNumber] Unique Numbers: ${[...uniqueNumbers]}, Output: ${result}`);
  return result;
}

// 19. Tính 4 đỉnh cao đời người
function calculatePeakNumbers(birthDate) {
  console.log(`[calculatePeakNumbers] Input: birthDate=${birthDate}`);
  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const lifePath = calculateLifePathNumber(birthDate);

    const peak1 = NumerologyUtils.reduceToSingleDigit(month + day);
    const peak2 = NumerologyUtils.reduceToSingleDigit(day + year);
    const peak3 = NumerologyUtils.reduceToSingleDigit(peak1 + peak2);
    const peak4 = NumerologyUtils.reduceToSingleDigit(month + year);

    const result = {
      firstPeak: peak1,
      secondPeak: peak2,
      thirdPeak: peak3,
      fourthPeak: peak4
    };

    console.log(`[calculatePeakNumbers] Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculatePeakNumbers] Error: ${error.message}`);
    return { firstPeak: 1, secondPeak: 1, thirdPeak: 1, fourthPeak: 1 };
  }
}

// 20. Thử thách ẩn (từ tên)
function calculateHiddenChallengeNumbers(name) {
  console.log(`[calculateHiddenChallengeNumbers] Input: name=${name}`);
  try {
    const expression = calculateExpressionNumber(name);
    const soulUrge = calculateSoulUrgeNumber(name);
    const personality = calculatePersonalityNumber(name);

    const result = {
      challenge1: Math.abs(expression - soulUrge),
      challenge2: Math.abs(soulUrge - personality),
      challenge3: Math.abs(personality - expression),
      ultimateChallenge: NumerologyUtils.reduceToSingleDigit(
        Math.abs(expression - soulUrge) +
        Math.abs(soulUrge - personality) +
        Math.abs(personality - expression)
      )
    };

    console.log(`[calculateHiddenChallengeNumbers] Expression: ${expression}, SoulUrge: ${soulUrge}, Personality: ${personality}, Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculateHiddenChallengeNumbers] Error: ${error.message}`);
    return { challenge1: 1, challenge2: 1, challenge3: 1, ultimateChallenge: 1 };
  }
}

// 21. 3 trụ cột chính
function calculateCoreNumbers(birthDate, name) {
  console.log(`[calculateCoreNumbers] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const result = {
      lifePath: calculateLifePathNumber(birthDate),
      expression: calculateExpressionNumber(name),
      soulUrge: calculateSoulUrgeNumber(name)
    };
    console.log(`[calculateCoreNumbers] Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculateCoreNumbers] Error: ${error.message}`);
    return { lifePath: 1, expression: 1, soulUrge: 1 };
  }
}

// 22. Kiểm tra số Nghiệp
function checkKarmicNumbers(birthDate, name) {
  console.log(`[checkKarmicNumbers] Input: birthDate=${birthDate}, name=${name}`);
  const hasKarmicDebt = (number) => {
    const debts = [13, 14, 16, 19];
    const result = debts.includes(number);
    console.log(`[checkKarmicNumbers] Checking number=${number}, hasKarmicDebt=${result}`);
    return result;
  };

  try {
    const result = {
      inLifePath: hasKarmicDebt(calculateLifePathNumber(birthDate)),
      inExpression: hasKarmicDebt(calculateExpressionNumber(name)),
      inBirthday: hasKarmicDebt(calculateBirthDayNumber(birthDate)),
      inPeaks: Object.values(calculatePeakNumbers(birthDate)).some(num => hasKarmicDebt(num))
    };
    console.log(`[checkKarmicNumbers] Output:`, result);
    return result;
  } catch (error) {
    console.error(`[checkKarmicNumbers] Error: ${error.message}`);
    return { inLifePath: false, inExpression: false, inBirthday: false, inPeaks: false };
  }
}

// 23. 5 góc của ngũ giác số
function calculatePentagonNumbers(birthDate, name) {
  console.log(`[calculatePentagonNumbers] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const result = {
      physical: calculateBirthDayNumber(birthDate),
      mental: calculatePersonalityNumber(name),
      emotional: calculateSoulUrgeNumber(name),
      intuitive: calculateChallengeNumber(birthDate),
      spiritual: calculateLifePathNumber(birthDate)
    };
    console.log(`[calculatePentagonNumbers] Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculatePentagonNumbers] Error: ${error.message}`);
    return { physical: 1, mental: 1, emotional: 1, intuitive: 1, spiritual: 1 };
  }
}

// 24. Tính Kim Tự Tháp Thần Số Học
function calculateNumerologyPyramid(birthDate, descriptions) {
  console.log(`[calculateNumerologyPyramid] Input: birthDate=${birthDate}`);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculateNumerologyPyramid] Invalid date format');
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  try {
    const [day, month, year] = birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month) {
      console.warn('[calculateNumerologyPyramid] Invalid date');
      throw new Error('Invalid date');
    }

    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const yearStr = year.toString();
    const monthNumber = NumerologyUtils.reduceToSingleDigit(month);
    const dayNumber = NumerologyUtils.reduceToSingleDigit(day);
    const yearNumber = NumerologyUtils.reduceToSingleDigit(
      year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    );

    const peak1 = NumerologyUtils.reduceToSingleDigit(month + day);
    const peak2 = NumerologyUtils.reduceToSingleDigit(day + year);
    const peak3 = NumerologyUtils.reduceToSingleDigit(peak1 + peak2);
    const peak4 = NumerologyUtils.reduceToSingleDigit(month + year);

    const challenge1 = Math.abs(monthNumber - dayNumber);
    const challenge2 = Math.abs(dayNumber - yearNumber);
    const challenge3 = Math.abs(challenge1 - challenge2);
    const challenge4 = Math.abs(peak1 - peak2);

    const lifePath = calculateLifePathNumber(birthDate);
    const birthYear = year;
    const firstPeakYear = birthYear + 36 - lifePath;

    const peaks = [
      {
        number: peak1,
        description: descriptions[peak1]?.meaning || 'Không có mô tả.',
        ageRange: '21-29 tuổi',
        startYear: firstPeakYear
      },
      {
        number: peak2,
        description: descriptions[peak2]?.meaning || 'Không có mô tả.',
        ageRange: '30-38 tuổi',
        startYear: firstPeakYear + 9
      },
      {
        number: peak3,
        description: descriptions[peak3]?.meaning || 'Không có mô tả.',
        ageRange: '39-47 tuổi',
        startYear: firstPeakYear + 18
      },
      {
        number: peak4,
        description: descriptions[peak4]?.meaning || 'Không có mô tả.',
        ageRange: '48-56 tuổi',
        startYear: firstPeakYear + 27
      }
    ];

    const challenges = [
      {
        number: challenge1,
        description: descriptions[`challenge_${challenge1}`]?.meaning || 'Không có mô tả.'
      },
      {
        number: challenge2,
        description: descriptions[`challenge_${challenge2}`]?.meaning || 'Không có mô tả.'
      },
      {
        number: challenge3,
        description: descriptions[`challenge_${challenge3}`]?.meaning || 'Không có mô tả.'
      },
      {
        number: challenge4,
        description: descriptions[`challenge_${challenge4}`]?.meaning || 'Không có mô tả.'
      }
    ];

    const result = {
      birthDate: {
        month: monthStr,
        day: dayStr,
        year: yearStr,
        monthNumber,
        dayNumber,
        yearNumber
      },
      peaks,
      challenges
    };

    console.log(`[calculateNumerologyPyramid] Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculateNumerologyPyramid] Error: ${error.message}`);
    throw error;
  }
}

// 25. Số Tương Hợp (Compatibility Number)
function calculateCompatibilityNumber(birthDate1, birthDate2) {
  console.log(`[calculateCompatibilityNumber] Input: birthDate1=${birthDate1}, birthDate2=${birthDate2}`);
  try {
    const lifePath1 = calculateLifePathNumber(birthDate1);
    const lifePath2 = calculateLifePathNumber(birthDate2);
    const sum = lifePath1 + lifePath2;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateCompatibilityNumber] LifePath1: ${lifePath1}, LifePath2: ${lifePath2}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateCompatibilityNumber] Error: ${error.message}`);
    return 1;
  }
}

// 26. Số Thử Thách Linh Hồn (Soul Challenge Number)
function calculateSoulChallengeNumber(name) {
  console.log(`[calculateSoulChallengeNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateSoulChallengeNumber] Invalid name, returning 1');
    return 1;
  }

  try {
    const soulUrgeNumber = calculateSoulUrgeNumber(name);
    const expressionNumber = calculateExpressionNumber(name);
    const difference = Math.abs(soulUrgeNumber - expressionNumber);
    const result = NumerologyUtils.reduceToSingleDigit(difference);
    console.log(`[calculateSoulChallengeNumber] SoulUrge: ${soulUrgeNumber}, Expression: ${expressionNumber}, Difference: ${difference}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateSoulChallengeNumber] Error: ${error.message}`);
    return 1;
  }
}

// 27. Chỉ số Thử Thách Nhân Cách (Personality Challenge Number)
function calculatePersonalityChallengeNumber(name, birthDate) {
  console.log(`[calculatePersonalityChallengeNumber] Input: name=${name}, birthDate=${birthDate}`);
  if (!name || typeof name !== 'string' || name.trim() === '' || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculatePersonalityChallengeNumber] Invalid inputs, returning 1');
    return 1;
  }

  try {
    const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
    const consonants = cleanName.split('').filter(char => !Object.keys(VOWELS).includes(char));

    if (consonants.length === 0) {
      console.warn('[calculatePersonalityChallengeNumber] No consonants, returning 1');
      return 1;
    }

    const sum = consonants.reduce((acc, char) => {
      const value = PYTHAGOREAN_CHART[char] || 0;
      console.log(`[calculatePersonalityChallengeNumber] Char: ${char}, Value: ${value}`);
      return acc + value;
    }, 0);

    const result = sum > 0 ? NumerologyUtils.reduceToSingleDigit(sum, true) : 1;
    console.log(`[calculatePersonalityChallengeNumber] Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculatePersonalityChallengeNumber] Error: ${error.message}`);
    return 1;
  }
}

// 28. Các Chỉ số Điểm Yếu (Weakness Numbers)
function calculateWeaknessNumbers(name) {
  console.log(`[calculateWeaknessNumbers] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateWeaknessNumbers] Invalid name, returning [1]');
    return [1];
  }

  try {
    const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
    const numberCounts = cleanName.split('').reduce((acc, char) => {
      const value = PYTHAGOREAN_CHART[char] || 0;
      if (value > 0) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(numberCounts), 0);
    const weaknesses = [];
    for (let i = 1; i <= 9; i++) {
      if (!numberCounts[i] || numberCounts[i] < maxCount / 2) {
        weaknesses.push(i);
      }
    }

    const result = weaknesses.length > 0 ? weaknesses : [1];
    console.log(`[calculateWeaknessNumbers] NumberCounts:`, numberCounts, `MaxCount: ${maxCount}, Output:`, result);
    return result;
  } catch (error) {
    console.error(`[calculateWeaknessNumbers] Error: ${error.message}`);
    return [1];
  }
}

// 29. Các Chỉ số Nợ Nghiệp (Karmic Debt Numbers)
function calculateKarmicDebtNumbers(fullName, birthDate) {
  console.log(`[calculateKarmicDebtNumbers] Input: fullName=${fullName}, birthDate=${birthDate}`);

  // 1. Validate input
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    console.warn('[calculateKarmicDebtNumbers] Invalid fullName');
    return defaultKarmicResult();
  }

  if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn('[calculateKarmicDebtNumbers] Invalid birthDate format');
    return defaultKarmicResult();
  }

  // 2. Parse and validate date
  const [day, month, year] = birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (isNaN(dateObj.getTime()) || 
      dateObj.getDate() !== day || 
      dateObj.getMonth() + 1 !== month ||
      year < 1900 || 
      year > new Date().getFullYear()) {
    console.warn('[calculateKarmicDebtNumbers] Invalid date values');
    return defaultKarmicResult();
  }

  // 3. Helper function to check karmic debt (including Master Numbers)
  const hasKarmicDebt = (number) => {
    const karmicNumbers = [13, 14, 16, 19, 11, 22]; // Extended with Master Numbers
    const isDebt = karmicNumbers.includes(number);
    console.log(`[KarmicCheck] number=${number}, isDebt=${isDebt}`);
    return isDebt;
  };

  // 4. Calculate core numbers (optimized)
  const coreNumbers = calculateCoreNumbers(birthDate, fullName); // Reuse existing function
  const birthdayNumber = calculateBirthDayNumber(birthDate);
  const peakNumbers = calculatePeakNumbers(birthDate);

  // 5. Check debts in all relevant numbers
  const result = {
    inLifePath: hasKarmicDebt(coreNumbers.lifePath),
    inExpression: hasKarmicDebt(coreNumbers.expression),
    inSoulUrge: hasKarmicDebt(coreNumbers.soulUrge),
    inBirthday: hasKarmicDebt(birthdayNumber),
    inPeaks: Object.values(peakNumbers).some(peak => hasKarmicDebt(peak)),
    // Additional checks for intermediate sums if needed
    inLifePathSum: hasKarmicDebt(day + month + year),
    inExpressionSum: hasKarmicDebt(
      [...fullName.toLowerCase()].reduce((sum, char) => sum + (PYTHAGOREAN_CHART[char] || 0), 0)
    )
  };

  console.log('[calculateKarmicDebtNumbers] Final result:', result);
  return result;
}

function defaultKarmicResult() {
  return {
    inLifePath: false,
    inExpression: false,
    inSoulUrge: false,
    inBirthday: false,
    inPeaks: false,
    inLifePathSum: false,
    inExpressionSum: false
  };
}

// 30. Chỉ số Năng Lực Tự Nhiên (Natural Ability Number)
function calculateNaturalAbilityNumber(birthDate, name) {
  console.log(`[calculateNaturalAbilityNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const expression = calculateExpressionNumber(name);
    const personality = calculatePersonalityNumber(name);
    const sum = lifePath + expression + personality;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateNaturalAbilityNumber] LifePath: ${lifePath}, Expression: ${expression}, Personality: ${personality}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateNaturalAbilityNumber] Error: ${error.message}`);
    return 1;
  }
}

// 31. Chỉ số Vượt Khó (Overcome Challenge Number)
function calculateOvercomeChallengeNumber(birthDate) {
  console.log(`[calculateOvercomeChallengeNumber] Input: birthDate=${birthDate}`);
  try {
    const lifePath = calculateLifePathNumber(birthDate);
    const challenge = calculateChallengeNumber(birthDate);
    const sum = lifePath + challenge;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateOvercomeChallengeNumber] LifePath: ${lifePath}, Challenge: ${challenge}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateOvercomeChallengeNumber] Error: ${error.message}`);
    return 1;
  }
}

// 32. Chỉ số Năng Lực Tư Duy (Mental Capacity Number)
function calculateMentalCapacityNumber(name) {
  console.log(`[calculateMentalCapacityNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateMentalCapacityNumber] Invalid name, returning 1');
    return 1;
  }

  try {
    const mentalChars = ['i', 'j', 'r', 'y', 'í', 'ì', 'ỉ', 'ĩ', 'ị', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'];
    const cleanName = name.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
    const sum = cleanName.split('').reduce((acc, char) => {
      const value = mentalChars.includes(char) ? PYTHAGOREAN_CHART[char] || 0 : 0;
      console.log(`[calculateMentalCapacityNumber] Char: ${char}, Value: ${value}`);
      return acc + value;
    }, 0);

    const result = sum > 0 ? NumerologyUtils.reduceToSingleDigit(sum) : 1;
    console.log(`[calculateMentalCapacityNumber] Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateMentalCapacityNumber] Error: ${error.message}`);
    return 1;
  }
}

// 33. Chỉ số Động Lực Tiếp Cận (Approach Motivation Number)
function calculateApproachMotivationNumber(birthDate, name) {
  console.log(`[calculateApproachMotivationNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const soulUrge = calculateSoulUrgeNumber(name);
    const birthDay = calculateBirthDayNumber(birthDate);
    const sum = soulUrge + birthDay;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateApproachMotivationNumber] SoulUrge: ${soulUrge}, BirthDay: ${birthDay}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateApproachMotivationNumber] Error: ${error.message}`);
    return 1;
  }
}

// 34. Chỉ số Năng Lực Tiếp Cận (Approach Capacity Number)
function calculateApproachCapacityNumber(name) {
  console.log(`[calculateApproachCapacityNumber] Input: name=${name}`);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.warn('[calculateApproachCapacityNumber] Invalid name, returning 1');
    return 1;
  }

  try {
    const expression = calculateExpressionNumber(name);
    const personality = calculatePersonalityNumber(name);
    const sum = expression + personality;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateApproachCapacityNumber] Expression: ${expression}, Personality: ${personality}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateApproachCapacityNumber] Error: ${error.message}`);
    return 1;
  }
}

// 35. Chỉ số Thái Độ Tiếp Cận (Approach Attitude Number)
function calculateApproachAttitudeNumber(birthDate, name) {
  console.log(`[calculateApproachAttitudeNumber] Input: birthDate=${birthDate}, name=${name}`);
  try {
    const attitude = calculateAttitudeNumber(birthDate);
    const soulUrge = calculateSoulUrgeNumber(name);
    const sum = attitude + soulUrge;
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log(`[calculateApproachAttitudeNumber] Attitude: ${attitude}, SoulUrge: ${soulUrge}, Sum: ${sum}, Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`[calculateApproachAttitudeNumber] Error: ${error.message}`);
    return 1;
  }
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
  calculateMaturePowerNumber,
  calculateSubconsciousSelfNumber,
  calculatePeakNumbers,
  calculateHiddenChallengeNumbers,
  calculateCoreNumbers,
  checkKarmicNumbers,
  calculatePentagonNumbers,
  calculateNumerologyPyramid,
  calculateCompatibilityNumber,
  calculateSoulChallengeNumber,
  calculatePersonalityChallengeNumber,
  calculateWeaknessNumbers,
  calculateKarmicDebtNumbers,
  calculateNaturalAbilityNumber,
  calculateOvercomeChallengeNumber,
  calculateMentalCapacityNumber,
  calculateApproachMotivationNumber,
  calculateApproachCapacityNumber,
  calculateApproachAttitudeNumber,
  NumerologyUtils
};