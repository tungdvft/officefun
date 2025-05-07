<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <!-- Header với hình ảnh trang trí -->
    <div class="text-center mb-8 relative">
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2">
        <svg class="w-12 h-12 text-blue-400 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Đặt Tên Cho Con Theo Thần Số Học</h1>
      <p class="text-gray-600">Tìm tên phù hợp nhất cho con yêu của bạn</p>
      <div class="absolute right-0 top-1/2 transform -translate-y-1/2">
        <svg class="w-12 h-12 text-pink-400 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Form nhập liệu -->
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
      <div class="flex items-center mb-4">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-800">Thông tin bố mẹ và bé</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Thông tin bố -->
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 class="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100 👶 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              Thông tin bố
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên bố</label>
              <input v-model="form.fatherName" type="text" placeholder="VD: Nguyễn Văn A" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh bố (DD/MM/YYYY)</label>
              <input v-model="form.fatherBirthDate" type="text" placeholder="VD: 15/04/1990" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
        </div>
        
        <!-- Thông tin mẹ -->
        <div class="space-y-4">
          <div class="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
            <h3 class="text-sm font-medium text-pink-800 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              Thông tin mẹ
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên mẹ</label>
              <input v-model="form.motherName" type="text" placeholder="VD: Trần Thị B" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh mẹ (DD/MM/YYYY)</label>
              <input v-model="form.motherBirthDate" type="text" placeholder="VD: 20/06/1992" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition" />
            </div>
          </div>
        </div>
        
        <!-- Thông tin bé -->
        <div class="space-y-4">
          <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <h3 class="text-sm font-medium text-purple-800 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
              Thông tin bé
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính bé</label>
              <select v-model="form.gender" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                <option value="male">Bé trai</option>
                <option value="female">Bé gái</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh bé (tùy chọn, DD/MM/YYYY)</label>
              <input v-model="form.babyBirthDate" type="text" placeholder="VD: 10/05/2025" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
            </div>
          </div>
        </div>
        
        <!-- Mục tiêu tương lai -->
        <div class="space-y-4">
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h3 class="text-sm font-medium text-green-800 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              Mục tiêu tương lai
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mục tiêu tương lai cho bé</label>
              <select v-model="form.futureGoal" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
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
      <div class="mt-6 text-center">
        <button @click="suggestNames" 
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:-translate-y-1">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          Gợi ý tên
        </button>
      </div>
    </div>
    
    <!-- Kết quả gợi ý tên -->
    <div v-if="suggestedNames.length" class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div class="flex items-center mb-4">
        <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-800">Tên gợi ý <span class="text-blue-600">(Mục tiêu: {{ form.futureGoal || 'Bất kỳ' }})</span></h2>
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
            <tr v-for="(name, index) in suggestedNames" :key="name.name" :class="{'bg-blue-50': index % 2 === 0}">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{{ name.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {{ name.destiny_number }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold">
                  {{ name.soul_urge }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ name.meaning }}</td>
              <td class="px-6 py-4 text-gray-700">
                <div class="space-y-1">
                  <p><span class="font-medium text-blue-800">Định mệnh:</span> {{ name.destiny_meaning }}</p>
                  <p><span class="font-medium text-purple-800">Linh hồn:</span> {{ name.soul_urge_meaning }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-700">
                <div class="space-y-1">
                  <p><span class="font-medium text-blue-800">Bố:</span> {{ name.father_compatibility_reason }}</p>
                  <p><span class="font-medium text-pink-800">Mẹ:</span> {{ name.mother_compatibility_reason }}</p>
                  <p v-if="name.baby_compatibility_reason"><span class="font-medium text-purple-800">Bé:</span> {{ name.baby_compatibility_reason }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Nút gợi ý thêm -->
      <div v-if="canSuggestMore" class="mt-6 text-center">
        <button @click="suggestMoreNames" 
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition transform hover:-translate-y-1">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Gợi ý thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

// Danh sách tên gợi ý và tên đã sử dụng
const suggestedNames = ref([]);
const usedNames = ref([]);

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

// Hàm gợi ý tên (khởi tạo danh sách mới)
const suggestNames = () => {
  if (!form.value.fatherBirthDate || !form.value.motherBirthDate) {
    alert('Vui lòng nhập ngày sinh của cả bố và mẹ.');
    return;
  }

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
    alert('Ngày sinh không hợp lệ. Vui lòng nhập định dạng DD/MM/YYYY.');
  }
};

// Hàm gợi ý thêm 5 tên
const suggestMoreNames = () => {
  if (!form.value.fatherBirthDate || !form.value.motherBirthDate) {
    alert('Vui lòng nhập ngày sinh của cả bố và mẹ.');
    return;
  }

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

    // Nếu không còn tên để gợi ý, thông báo
    if (newNames.length === 0) {
      alert('Đã hết tên để gợi ý. Vui lòng thay đổi mục tiêu hoặc giới tính để có thêm gợi ý.');
    }
  } catch (error) {
    alert('Ngày sinh không hợp lệ. Vui lòng nhập định dạng DD/MM/YYYY.');
  }
};
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>