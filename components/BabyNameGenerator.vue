<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Đặt Tên Cho Con Theo Thần Số Học</h1>
    
    <!-- Form nhập liệu -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Thông tin bố mẹ và bé</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Thông tin bố -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Họ tên bố</label>
          <input v-model="form.fatherName" type="text" placeholder="VD: Nguyễn Văn A" class="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ngày sinh bố (DD/MM/YYYY)</label>
          <input v-model="form.fatherBirthDate" type="text" placeholder="VD: 15/04/1990" class="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <!-- Thông tin mẹ -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Họ tên mẹ</label>
          <input v-model="form.motherName" type="text" placeholder="VD: Trần Thị B" class="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ngày sinh mẹ (DD/MM/YYYY)</label>
          <input v-model="form.motherBirthDate" type="text" placeholder="VD: 20/06/1992" class="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <!-- Thông tin bé -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Giới tính bé</label>
          <select v-model="form.gender" class="mt-1 block w-full p-2 border rounded-md">
            <option value="male">Bé trai</option>
            <option value="female">Bé gái</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ngày sinh bé (tùy chọn, DD/MM/YYYY)</label>
          <input v-model="form.babyBirthDate" type="text" placeholder="VD: 10/05/2025" class="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <!-- Mục tiêu tương lai -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Mục tiêu tương lai cho bé</label>
          <select v-model="form.futureGoal" class="mt-1 block w-full p-2 border rounded-md">
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
      
      <!-- Nút gợi ý tên -->
      <button @click="suggestNames" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Gợi ý tên
      </button>
    </div>
    
    <!-- Kết quả gợi ý tên -->
    <div v-if="suggestedNames.length" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Tên gợi ý (Mục tiêu: {{ form.futureGoal || 'Bất kỳ' }})</h2>
      <div class="overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Tên</th>
              <th class="px-4 py-2">Số định mệnh</th>
              <th class="px-4 py-2">Số linh hồn</th>
              <th class="px-4 py-2">Ý nghĩa tên</th>
              <th class="px-4 py-2">Ý nghĩa thần số học</th>
              <th class="px-4 py-2">Tương hợp</th>
              <th class="px-4 py-2">Diễn giải tương hợp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="name in suggestedNames" :key="name.name" class="border-b">
              <td class="px-4 py-2">{{ name.name }}</td>
              <td class="px-4 py-2">{{ name.destiny_number }}</td>
              <td class="px-4 py-2">{{ name.soul_urge }}</td>
              <td class="px-4 py-2">{{ name.meaning }}</td>
              <td class="px-4 py-2">
                <p><strong>Định mệnh:</strong> {{ name.destiny_meaning }}</p>
                <p><strong>Linh hồn:</strong> {{ name.soul_urge_meaning }}</p>
              </td>
              <td class="px-4 py-2">
                <p>Bố: {{ name.father_compatibility }}</p>
                <p>Mẹ: {{ name.mother_compatibility }}</p>
                <p v-if="name.baby_compatibility">Bé: {{ name.baby_compatibility }}</p>
              </td>
              <td class="px-4 py-2">
                <p><strong>Bố:</strong> {{ name.father_compatibility_reason }}</p>
                <p><strong>Mẹ:</strong> {{ name.mother_compatibility_reason }}</p>
                <p v-if="name.baby_compatibility_reason"><strong>Bé:</strong> {{ name.baby_compatibility_reason }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Nút gợi ý thêm -->
      <div v-if="canSuggestMore" class="mt-4 text-center">
        <button @click="suggestMoreNames" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
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

    // Nếu không có tên nào khớp mục tiêu, lấy tất cả tên
    if (filteredNames.length === 0) {
      filteredNames = names;
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

    // Nếu không có tên nào khớp mục tiêu, lấy tất cả tên
    if (filteredNames.length === 0) {
      filteredNames = names;
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