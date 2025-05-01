const NumerologyUtils = {
  reduceToSingleDigit: (number) => {
    if ([11, 22, 33].includes(number)) return number; // Giữ nguyên Master Numbers
    let sum = number;
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return sum; // Không ép buộc trả về 1 nếu sum là 0
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

// ... (giữ nguyên các hàm khác: calculateLifePathNumber, calculateExpressionNumber, v.v.)

// 3. Số Linh hồn (Soul Urge Number)
function calculateSoulUrgeNumber(name) {
  try {
    console.log('calculateSoulUrgeNumber called with name:', name);
    if (!name || typeof name !== 'string') {
      console.warn('Invalid name input, returning 1');
      return 1;
    }
    
    const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    console.log('Cleaned name:', cleanName);
    
    const sum = cleanName.split('').reduce((acc, char) => {
      const value = VOWELS[char] || 0;
      console.log(`Char: ${char}, VOWEL value: ${value}`);
      return acc + value;
    }, 0);
    
    console.log('Sum of vowels:', sum);
    
    if (sum === 0) {
      console.warn('No vowels found in name, returning 1');
      return 1; // Trả về 1 nếu không có nguyên âm
    }
    
    const result = NumerologyUtils.reduceToSingleDigit(sum);
    console.log('Soul Urge Number result:', result);
    return result;
  } catch (err) {
    console.error('Error in calculateSoulUrgeNumber:', err);
    return 1;
  }
}

// ... (giữ nguyên các hàm khác)

// Export
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
  NumerologyUtils
};
