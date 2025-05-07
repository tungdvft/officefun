<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Đặt Tên Cho Con Theo Thần Số Học</h1>
        <p class="text-lg text-gray-600">Tìm tên phù hợp nhất cho con yêu của bạn</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="flex items-center mb-4">
          <span class="bg-purple-100 p-2 rounded-full mr-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </span>
          <h2 class="text-xl font-semibold text-purple-700">Thông tin bố mẹ và bé</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Thông tin bố -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin bố
              </h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">Họ tên bố</label>
                <input
                  v-model="form.fatherName"
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.fatherName ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.fatherName" class="text-red-600 text-sm mt-1">{{ errors.fatherName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mt-4 mb-3">Ngày sinh bố (DD/MM/YYYY)</label>
                <input
                  v-model="form.fatherBirthDate"
                  type="text"
                  placeholder="VD: 15/04/1990"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.fatherBirthDate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.fatherBirthDate" class="text-red-600 text-sm mt-1">{{ errors.fatherBirthDate }}</p>
              </div>
            </div>
          </div>

          <!-- Thông tin mẹ -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin mẹ
              </h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">Họ tên mẹ</label>
                <input
                  v-model="form.motherName"
                  type="text"
                  placeholder="VD: Trần Thị B"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.motherName ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.motherName" class="text-red-600 text-sm mt-1">{{ errors.motherName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3 mt-4">Ngày sinh mẹ (DD/MM/YYYY)</label>
                <input
                  v-model="form.motherBirthDate"
                  type="text"
                  placeholder="VD: 20/06/1992"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.motherBirthDate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.motherBirthDate" class="text-red-600 text-sm mt-1">{{ errors.motherBirthDate }}</p>
              </div>
            </div>
          </div>

          <!-- Thông tin bé -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </span>
                Thông tin bé
              </h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">Giới tính bé</label>
                <select
                  v-model="form.gender"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                >
                  <option value="male">Bé trai</option>
                  <option value="female">Bé gái</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3 mt-4">Ngày sinh bé (tùy chọn, DD/MM/YYYY)</label>
                <input
                  v-model="form.babyBirthDate"
                  type="text"
                  placeholder="VD: 10/05/2025"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.babyBirthDate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.babyBirthDate" class="text-red-600 text-sm mt-1">{{ errors.babyBirthDate }}</p>
              </div>
            </div>
          </div>

          <!-- Mục tiêu tương lai -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </span>
                Mục tiêu tương lai
              </h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">Mục tiêu tương lai cho bé</label>
                <select
                  v-model="form.futureGoal"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                >
                  <option value="">Bất kỳ</option>
                  <option value="Trở thành nhà lãnh đạo xuất sắc">Trở thành nhà lãnh đạo xuất sắc</option>
                  <option value="Trở thành người sáng tạo đổi mới">Trở thành người sáng tạo đổi mới</option>
                  <option value="Trở thành người mang lại hòa bình">Trở thành người mang lại hòa bình</option>
                  <option value="Trở thành người thành công vượt bậc">Trở thành người thành công vượt bậc</option>
                  <option value="Trở thành nhà trí tuệ sâu sắc">Trở thành nhà trí tuệ sâu sắc</option>
                  <option value="Trở thành người kết nối tâm linh">Trở thành người kết nối tâm linh</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút gợi ý tên -->
        <div class="mt-6 flex justify-center">
          <button
            @click="suggestNames"
            class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              Gợi ý tên
            </span>
          </button>
        </div>
      </div>

      <!-- Kết quả gợi ý tên -->
      <transition name="slide-fade">
        <div v-if="suggestedNames.length" class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center mb-4">
            <span class="bg-purple-100 p-2 rounded-full mr-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
            <h2 class="text-xl font-semibold text-purple-700">
              Tên gợi ý <span class="text-purple-600">(Mục tiêu: {{ form.futureGoal || 'Bất kỳ' }})</span>
            </h2>
          </div>

          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tên</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số định mệnh</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số linh hồn</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ý nghĩa tên</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ý nghĩa thần số học</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Diễn giải tương hợp</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(name, index) in suggestedNames" :key="name.name" :class="{'bg-purple-50': index % 2 === 0}">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-purple-600">{{ name.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold">
                      {{ name.destiny_number }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold">
                      {{ name.soul_urge }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ name.meaning }}</td>
                  <td class="px-6 py-4 text-gray-600">
                    <div class="space-y-1">
                      <p><span class="font-medium text-purple-800">Định mệnh:</span> {{ name.destiny_meaning }}</p>
                      <p><span class="font-medium text-purple-800">Linh hồn:</span> {{ name.soul_urge_meaning }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">
                    <div class="space-y-1">
                      <p><span class="font-medium text-purple-800">Bố:</span> {{ name.father_compatibility_reason }}</p>
                      <p><span class="font-medium text-purple-800">Mẹ:</span> {{ name.mother_compatibility_reason }}</p>
                      <p v-if="name.baby_compatibility_reason"><span class="font-medium text-purple-800">Bé:</span> {{ name.baby_compatibility_reason }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Nút gợi ý thêm -->
          <div v-if="canSuggestMore" class="mt-6 flex justify-center">
            <button
              @click="suggestMoreNames"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Gợi ý thêm
              </span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';
import { ExpressionNumbers, SoulUrgeNumbers } from '~/utils/numerology-meanings';
import babyMaleNames from '~/data/baby_male_name.json';
import babyFemaleNames from '~/data/baby_female_name.json';
import nameCompatibility from '~/data/name_compatibility.json';

// Form dữ liệu
const form = ref({
  fatherName: '',
  fatherBirthDate: '',
  motherName: '',
  motherBirthDate: '',
  gender: 'male',
  babyBirthDate: '',
  futureGoal: ''
});

// Trạng thái lỗi
const errors = ref({
  fatherName: '',
  fatherBirthDate: '',
  motherName: '',
  motherBirthDate: '',
  babyBirthDate: ''
});

// Danh sách tên gợi ý và tên đã sử dụng
const suggestedNames = ref([]);
const usedNames = ref([]);

// Hàm lưu vào localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('babyNameSuggestorForm', JSON.stringify(form.value));
  localStorage.setItem('babyNameSuggestorSuggestedNames', JSON.stringify(suggestedNames.value));
  localStorage.setItem('babyNameSuggestorUsedNames', JSON.stringify(usedNames.value));
};

// Hàm tải từ localStorage
const loadFromLocalStorage = () => {
  const savedForm = localStorage.getItem('babyNameSuggestorForm');
  const savedSuggestedNames = localStorage.getItem('babyNameSuggestorSuggestedNames');
  const savedUsedNames = localStorage.getItem('babyNameSuggestorUsedNames');

  if (savedForm) {
    form.value = JSON.parse(savedForm);
  }
  if (savedSuggestedNames) {
    suggestedNames.value = JSON.parse(savedSuggestedNames);
  }
  if (savedUsedNames) {
    usedNames.value = JSON.parse(savedUsedNames);
  }
};

// Tải dữ liệu khi component được mounted
onMounted(() => {
  loadFromLocalStorage();
});

// Theo dõi thay đổi để lưu vào localStorage
watch(form, () => {
  saveToLocalStorage();
}, { deep: true });

watch(suggestedNames, () => {
  saveToLocalStorage();
}, { deep: true });

// Kiểm tra xem còn tên để gợi ý không
const canSuggestMore = computed(() => {
  const names = form.value.gender === 'male' ? babyMaleNames : babyFemaleNames;
  let availableNames = names;
  if (form.value.futureGoal) {
    const goalDestinyNumbers = nameCompatibility.future_goals[form.value.futureGoal].recommended_destiny_numbers;
    availableNames = names.filter(name => goalDestinyNumbers.includes(name.destiny_number));
  }
  // Loại bỏ tên trùng với bố hoặc mẹ
  const parentNames = [
    form.value.fatherName.split(' ').pop()?.toLowerCase(),
    form.value.motherName.split(' ').pop()?.toLowerCase()
  ].filter(name => name);
  availableNames = availableNames.filter(name => {
    const nameParts = name.name.toLowerCase().split(' ');
    return !nameParts.some(part => parentNames.includes(part));
  });
  return availableNames.length > usedNames.value.length;
});

// Hàm validate form
const validateForm = () => {
  errors.value = {
    fatherName: '',
    fatherBirthDate: '',
    motherName: '',
    motherBirthDate: '',
    babyBirthDate: ''
  };
  let isValid = true;

  // Kiểm tra trường trống
  if (!form.value.fatherName.trim()) {
    errors.value.fatherName = 'Vui lòng nhập họ tên bố';
    isValid = false;
  }
  if (!form.value.fatherBirthDate.trim()) {
    errors.value.fatherBirthDate = 'Vui lòng nhập ngày sinh bố';
    isValid = false;
  }
  if (!form.value.motherName.trim()) {
    errors.value.motherName = 'Vui lòng nhập họ tên mẹ';
    isValid = false;
  }
  if (!form.value.motherBirthDate.trim()) {
    errors.value.motherBirthDate = 'Vui lòng nhập ngày sinh mẹ';
    isValid = false;
  }

  // Kiểm tra định dạng ngày sinh
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const validateDate = (dateStr, field) => {
    if (!dateStr) return true; // Không kiểm tra nếu trường trống (cho babyBirthDate)
    const match = dateStr.match(dateRegex);
    if (!match) {
      errors.value[field] = 'Ngày sinh không đúng định dạng DD/MM/YYYY';
      return false;
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      errors.value[field] = 'Ngày sinh không hợp lệ';
      return false;
    }
    return true;
  };

  if (form.value.fatherBirthDate && !validateDate(form.value.fatherBirthDate, 'fatherBirthDate')) {
    isValid = false;
  }
  if (form.value.motherBirthDate && !validateDate(form.value.motherBirthDate, 'motherBirthDate')) {
    isValid = false;
  }
  if (form.value.babyBirthDate && !validateDate(form.value.babyBirthDate, 'babyBirthDate')) {
    isValid = false;
  }

  return isValid;
};

// Hàm gợi ý tên (khởi tạo danh sách mới)
const suggestNames = () => {
  if (!validateForm()) return;

  try {
    const fatherLifePath = calculateLifePathNumber(form.value.fatherBirthDate);
    const motherLifePath = calculateLifePathNumber(form.value.motherBirthDate);
    const babyLifePath = form.value.babyBirthDate ? calculateLifePathNumber(form.value.babyBirthDate) : null;

    const names = form.value.gender === 'male' ? babyMaleNames : babyFemaleNames;
    let filteredNames = names;

    // Lọc theo mục tiêu tương lai nếu có
    if (form.value.futureGoal) {
      const goalDestinyNumbers = nameCompatibility.future_goals[form.value.futureGoal].recommended_destiny_numbers;
      filteredNames = names.filter(name => goalDestinyNumbers.includes(name.destiny_number));
    }

    // Loại bỏ tên trùng với bố hoặc mẹ
    const parentNames = [
      form.value.fatherName.split(' ').pop()?.toLowerCase(),
      form.value.motherName.split(' ').pop()?.toLowerCase()
    ].filter(name => name);
    filteredNames = filteredNames.filter(name => {
      const nameParts = name.name.toLowerCase().split(' ');
      return !nameParts.some(part => parentNames.includes(part));
    });

    // Nếu không có tên nào khớp mục tiêu, lấy tất cả tên (vẫn loại trừ tên bố/mẹ)
    if (filteredNames.length === 0) {
      filteredNames = names.filter(name => {
        const nameParts = name.name.toLowerCase().split(' ');
        return !nameParts.some(part => parentNames.includes(part));
      });
    }

    // Loại bỏ các tên đã sử dụng
    filteredNames = filteredNames.filter(name => !usedNames.value.includes(name.name));

    // Lấy danh sách tên gợi ý (tối đa 5 tên)
    const newNames = filteredNames.slice(0, 5).map(name => ({
      name: name.name,
      destiny_number: name.destiny_number,
      soul_urge: name.soul_urge,
      meaning: name.meaning,
      destiny_meaning: ExpressionNumbers[name.destiny_number].theme,
      soul_urge_meaning: SoulUrgeNumbers[name.soul_urge].desire,
      father_compatibility: nameCompatibility.compatibility[fatherLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : 'Không hợp',
      mother_compatibility: nameCompatibility.compatibility[motherLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : 'Không hợp',
      baby_compatibility: babyLifePath && nameCompatibility.compatibility[babyLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : babyLifePath ? 'Không hợp' : null,
      father_compatibility_reason: nameCompatibility.compatibility[fatherLifePath].reason,
      mother_compatibility_reason: nameCompatibility.compatibility[motherLifePath].reason,
      baby_compatibility_reason: babyLifePath ? nameCompatibility.compatibility[babyLifePath].reason : null
    }));

    // Cập nhật danh sách tên gợi ý và tên đã sử dụng
    suggestedNames.value = newNames;
    usedNames.value = newNames.map(name => name.name);
  } catch (error) {
    errors.value.fatherBirthDate = 'Không thể xử lý ngày sinh bố';
    errors.value.motherBirthDate = 'Không thể xử lý ngày sinh mẹ';
    if (form.value.babyBirthDate) {
      errors.value.babyBirthDate = 'Không thể xử lý ngày sinh bé';
    }
  }
};

// Hàm gợi ý thêm 5 tên
const suggestMoreNames = () => {
  if (!validateForm()) return;

  try {
    const fatherLifePath = calculateLifePathNumber(form.value.fatherBirthDate);
    const motherLifePath = calculateLifePathNumber(form.value.motherBirthDate);
    const babyLifePath = form.value.babyBirthDate ? calculateLifePathNumber(form.value.babyBirthDate) : null;

    const names = form.value.gender === 'male' ? babyMaleNames : babyFemaleNames;
    let filteredNames = names;

    // Lọc theo mục tiêu tương lai nếu có
    if (form.value.futureGoal) {
      const goalDestinyNumbers = nameCompatibility.future_goals[form.value.futureGoal].recommended_destiny_numbers;
      filteredNames = names.filter(name => goalDestinyNumbers.includes(name.destiny_number));
    }

    // Loại bỏ tên trùng với bố hoặc mẹ
    const parentNames = [
      form.value.fatherName.split(' ').pop()?.toLowerCase(),
      form.value.motherName.split(' ').pop()?.toLowerCase()
    ].filter(name => name);
    filteredNames = filteredNames.filter(name => {
      const nameParts = name.name.toLowerCase().split(' ');
      return !nameParts.some(part => parentNames.includes(part));
    });

    // Nếu không có tên nào khớp mục tiêu, lấy tất cả tên (vẫn loại trừ tên bố/mẹ)
    if (filteredNames.length === 0) {
      filteredNames = names.filter(name => {
        const nameParts = name.name.toLowerCase().split(' ');
        return !nameParts.some(part => parentNames.includes(part));
      });
    }

    // Loại bỏ các tên đã sử dụng
    filteredNames = filteredNames.filter(name => !usedNames.value.includes(name.name));

    // Lấy thêm 5 tên mới
    const newNames = filteredNames.slice(0, 5).map(name => ({
      name: name.name,
      destiny_number: name.destiny_number,
      soul_urge: name.soul_urge,
      meaning: name.meaning,
      destiny_meaning: ExpressionNumbers[name.destiny_number].theme,
      soul_urge_meaning: SoulUrgeNumbers[name.soul_urge].desire,
      father_compatibility: nameCompatibility.compatibility[fatherLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : 'Không hợp',
      mother_compatibility: nameCompatibility.compatibility[motherLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : 'Không hợp',
      baby_compatibility: babyLifePath && nameCompatibility.compatibility[babyLifePath].recommended_destiny_numbers.includes(name.destiny_number) ? 'Hợp' : babyLifePath ? 'Không hợp' : null,
      father_compatibility_reason: nameCompatibility.compatibility[fatherLifePath].reason,
      mother_compatibility_reason: nameCompatibility.compatibility[motherLifePath].reason,
      baby_compatibility_reason: babyLifePath ? nameCompatibility.compatibility[babyLifePath].reason : null
    }));

    // Thêm tên mới vào danh sách gợi ý và cập nhật tên đã sử dụng
    suggestedNames.value = [...suggestedNames.value, ...newNames];
    usedNames.value = [...usedNames.value, ...newNames.map(name => name.name)];

    // Nếu không còn tên để gợi ý, hiển thị lỗi
    if (newNames.length === 0) {
      errors.value.fatherName = 'Đã hết tên để gợi ý. Vui lòng thay đổi mục tiêu hoặc giới tính.';
    }
  } catch (error) {
    errors.value.fatherBirthDate = 'Không thể xử lý ngày sinh bố';
    errors.value.motherBirthDate = 'Không thể xử lý ngày sinh mẹ';
    if (form.value.babyBirthDate) {
      errors.value.babyBirthDate = 'Không thể xử lý ngày sinh bé';
    }
  }
};
</script>

<style scoped>
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    font-size: 1.875rem;
  }
}
</style>