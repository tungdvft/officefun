import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import challengeData from '~/data/ChallengeData.json';
import maturityData from '~/data/MaturityData.json';
import maturePowerData from '~/data/MaturePowerData.json';
import soulUrgeData from '~/data/SoulUrgeData.json';
import {
  calculateChallengeNumber,
  calculateMaturityNumber,
  calculateMaturePowerNumber,
  calculateSoulUrgeNumber,
} from '@/utils/numerology-calculations';

export function useNumerologyData(type, birthDate, fullName) {
  const number = ref(null);
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Dữ liệu JSON và hàm tính toán theo type
  const dataMap = {
    challenge: { json: challengeData, calculate: calculateChallengeNumber },
    maturity: { json: maturityData, calculate: calculateMaturityNumber },
    maturePower: { json: maturePowerData, calculate: calculateMaturePowerNumber },
    soulUrge: { json: soulUrgeData, calculate: calculateSoulUrgeNumber },
  };

  const selectedData = dataMap[type];
  if (!selectedData) {
    error.value = `Invalid numerology type: ${type}`;
    console.error(error.value);
    return { number, data, loading, error };
  }

  // Hàm xác thực đầu vào
  const validateInputs = () => {
    if (type === 'soulUrge') {
      if (!fullName.value || fullName.value.trim() === '' || !/[aeiou]/i.test(fullName.value)) {
        error.value = 'Vui lòng nhập tên đầy đủ chứa nguyên âm!';
        toast.error(error.value);
        console.warn('Validation failed: invalid fullName');
        return false;
      }
      return true;
    }

    if (!fullName.value || fullName.value.trim() === '') {
      error.value = 'Vui lòng nhập tên đầy đủ!';
      toast.error(error.value);
      console.warn('Validation failed: fullName is empty');
      return false;
    }

    if (!birthDate.value) {
      error.value = 'Vui lòng nhập ngày sinh!';
      toast.error(error.value);
      console.warn('Validation failed: birthDate is empty');
      return false;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
      error.value = 'Ngày sinh không đúng định dạng (DD/MM/YYYY)!';
      toast.error(error.value);
      console.warn('Validation failed: invalid birthDate format');
      return false;
    }

    const [day, month, year] = birthDate.value.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      error.value = 'Ngày sinh không hợp lệ!';
      toast.error(error.value);
      console.warn('Validation failed: invalid birthDate');
      return false;
    }

    return true;
  };

  // Hàm lấy dữ liệu
  const fetchData = async () => {
    console.log(`fetchData called for ${type} with birthDate:`, birthDate.value, 'fullName:', fullName.value);

    if (!validateInputs()) {
      console.warn(`fetchData aborted due to invalid inputs for ${type}`);
      return;
    }

    loading.value = true;
    number.value = null;
    data.value = null;
    error.value = null;

    try {
      // Tính số dựa trên type
      const calculatedNumber = type === 'soulUrge'
        ? selectedData.calculate(fullName.value)
        : type === 'challenge'
        ? selectedData.calculate(birthDate.value)
        : selectedData.calculate(birthDate.value, fullName.value);

      if (!calculatedNumber || calculatedNumber < 1) {
        error.value = `Số ${type} tính toán không hợp lệ: ${calculatedNumber}`;
        console.warn(error.value);
        number.value = type === 'soulUrge' ? 1 : 5; // Mặc định 1 cho soulUrge
        data.value = {
          description: `Dữ liệu mẫu cho số ${type} ${number.value}.`,
          advice: 'Hãy kiểm tra lại họ tên hoặc thử lại sau.',
          traits: 'Dữ liệu mẫu, chưa phản ánh chính xác.',
          challenges: 'Chưa xác định thách thức cụ thể.',
        };
      } else {
        number.value = calculatedNumber;
        data.value = selectedData.json.numbers.find((item) => item.number === calculatedNumber);

        if (!data.value) {
          error.value = `Không tìm thấy dữ liệu cho số ${type} ${calculatedNumber}`;
          console.warn(error.value);
          data.value = {
            description: `Số ${type} ${calculatedNumber}.`,
            advice: 'Chưa có dữ liệu chi tiết.',
            traits: 'Hãy khám phá thêm về bản thân.',
            challenges: 'Chưa xác định thách thức cụ thể.',
          };
        }
      }
    } catch (err) {
      error.value = `Lỗi khi tính ${type}: ${err.message}`;
      toast.error(error.value);
      console.error(error.value);
      number.value = type === 'soulUrge' ? 1 : 5; // Mặc định 1 cho soulUrge
      data.value = {
        description: `Lỗi khi tính số ${type}.`,
        advice: 'Vui lòng kiểm tra lại dữ liệu đầu vào.',
        traits: 'Không thể xác định đặc điểm.',
        challenges: 'Không thể xác định thách thức.',
      };
    } finally {
      loading.value = false;
    }
  };

  // Theo dõi birthDate và fullName
  watch(
    [birthDate, fullName],
    ([newBirthDate, newFullName]) => {
      if (type === 'soulUrge' && newFullName && /[aeiou]/i.test(newFullName)) {
        fetchData();
      } else if (
        newBirthDate &&
        newFullName &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)
      ) {
        fetchData();
      } else {
        console.warn(`Watch skipped for ${type}: invalid inputs`, { newBirthDate, newFullName });
      }
    },
    { immediate: true }
  );

  // Gọi khi mount
  onMounted(() => {
    if (type === 'soulUrge' && fullName.value && /[aeiou]/i.test(fullName.value)) {
      fetchData();
    } else if (
      birthDate.value &&
      fullName.value &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)
    ) {
      fetchData();
    } else {
      console.warn(`Mount skipped for ${type}: invalid initial inputs`, { birthDate: birthDate.value, fullName: fullName.value });
    }
  });

  return { number, data, loading, error };
}