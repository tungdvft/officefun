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

  // Dữ liệu JSON và hàm tính toán theo type
  const dataMap = {
    challenge: { json: challengeData, calculate: calculateChallengeNumber },
    maturity: { json: maturityData, calculate: calculateMaturityNumber },
    maturePower: { json: maturePowerData, calculate: calculateMaturePowerNumber },
    soulUrge: { json: soulUrgeData, calculate: calculateSoulUrgeNumber },
  };

  const selectedData = dataMap[type];
  if (!selectedData) {
    console.error(`Invalid numerology type: ${type}`);
    throw new Error(`Invalid numerology type: ${type}`);
  }

  // Hàm xác thực đầu vào
  const validateInputs = () => {
    console.log(`Validating inputs for ${type}: birthDate=${birthDate.value}, fullName=${fullName.value}`);
    
    if (!fullName.value || fullName.value.trim() === '') {
      toast.error('Vui lòng nhập họ tên!');
      console.warn('Validation failed: fullName is empty');
      return false;
    }

    if (!birthDate.value) {
      toast.error('Vui lòng nhập ngày sinh!');
      console.warn('Validation failed: birthDate is empty');
      return false;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
      toast.error('Ngày sinh không đúng định dạng (DD/MM/YYYY)!');
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
      toast.error('Ngày sinh không hợp lệ!');
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

    try {
      // Tính số dựa trên type
      const calculatedNumber = type === 'challenge' 
        ? selectedData.calculate(birthDate.value) 
        : type === 'soulUrge'
        ? selectedData.calculate(fullName.value)
        : selectedData.calculate(birthDate.value, fullName.value);
      
      console.log(`Calculated number for ${type}:`, calculatedNumber);

      if (!calculatedNumber || calculatedNumber < 1) {
        console.warn(`Invalid calculated number for ${type}:`, calculatedNumber);
        // Sử dụng dữ liệu mẫu thay vì throw lỗi
        number.value = type === 'challenge' ? 5 : type === 'maturity' ? 4 : type === 'maturePower' ? 8 : 9;
        data.value = {
          description: `Dữ liệu mẫu cho số ${type} ${number.value}.`,
          advice: 'Hãy kiểm tra lại họ tên hoặc thử lại sau.',
          traits: 'Dữ liệu mẫu, chưa phản ánh chính xác.',
          challenges: 'Chưa xác định thách thức cụ thể.',
        };
        toast.warn(`Không thể tính chỉ số ${type} do dữ liệu không hợp lệ, sử dụng dữ liệu mẫu!`);
      } else {
        number.value = calculatedNumber;
        data.value = selectedData.json.numbers.find((item) => item.number === calculatedNumber);

        if (!data.value) {
          console.warn(`No data found in ${type} JSON for number:`, calculatedNumber);
          data.value = {
            description: `Số ${type} ${calculatedNumber}.`,
            advice: 'Chưa có dữ liệu chi tiết.',
            traits: 'Hãy khám phá thêm về bản thân.',
            challenges: 'Chưa xác định thách thức cụ thể.',
          };
        }

        console.log(`Data for ${type}:`, data.value);
        toast.success(`Tạo báo cáo chỉ số ${type} hoàn tất!`);
      }
    } catch (err) {
      console.error(`Error in fetchData (${type}):`, err);
      toast.warn(`Không thể tính chỉ số ${type}, sử dụng dữ liệu mẫu!`);
      // Dữ liệu mẫu
      number.value = type === 'challenge' ? 5 : type === 'maturity' ? 4 : type === 'maturePower' ? 8 : 9;
      data.value = {
        description: `Dữ liệu mẫu cho số ${type} ${number.value}.`,
        advice: 'Hãy kiểm tra lại dữ liệu đầu vào hoặc thử lại sau.',
        traits: 'Dữ liệu mẫu, chưa phản ánh chính xác.',
        challenges: 'Chưa xác định thách thức cụ thể.',
      };
    } finally {
      loading.value = false;
    }
  };

  // Theo dõi birthDate và fullName
  watch(
    [birthDate, fullName],
    ([newBirthDate, newFullName]) => {
      console.log(`watch triggered for ${type} - birthDate:`, newBirthDate, 'fullName:', newFullName);
      if (newBirthDate && newFullName && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
        fetchData();
      } else {
        console.warn(`Watch skipped for ${type}: invalid inputs`, { newBirthDate, newFullName });
      }
    },
    { immediate: true }
  );

  // Gọi khi mount
  onMounted(() => {
    console.log(`${type} composable mounted`);
    if (birthDate.value && fullName.value && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
      fetchData();
    } else {
      console.warn(`Mount skipped for ${type}: invalid initial inputs`, { birthDate: birthDate.value, fullName: fullName.value });
    }
  });

  return { number, data, loading };
}
