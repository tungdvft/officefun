<template>
  <div class="mt-8 bg-white rounded-xl shadow-2xl p-6">
    <h2
      class="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-6"
    >
      Game vui giải trí
    </h2>
    <!-- Tabs -->
    <div class="flex border-b mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 -mb-px',
          activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' : 'text-gray-600',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    <!-- Nội dung tab -->
    <div v-if="activeTab === 'guess-icon'" class="text-center">
      <div v-if="isLoading" class="text-gray-500 mb-6">Đang tải câu đố...</div>
      <div v-else-if="!isGameFinished">
        <div class="flex justify-center gap-4 mb-6 text-4xl">
          <span>{{ currentGame.icons[0] }}</span>
          <span>{{ currentGame.icons[1] }}</span>
          <span>{{ currentGame.icons[2] }}</span>
        </div>
        <div class="grid gap-4 max-w-md mx-auto">
          <button
            v-for="(option, index) in currentGame.options"
            :key="index"
            @click="checkAnswer(option)"
            class="p-3 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors text-gray-700"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-lg text-gray-700 mb-4">
          {{ isCorrect ? 'Chính xác! 🎉' : 'Sai rồi, đáp án là: ' + currentGame.answer }}
        </p>
        <button
          @click="startNewGame"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
        >
          Chơi tiếp
        </button>
      </div>
    </div>
    <div v-else-if="activeTab === 'sudoku'" class="text-center">
      <div v-if="isSudokuLoading" class="text-gray-500 mb-6">Đang tạo bảng Sudoku...</div>
      <div v-else>
        <div class="grid grid-cols-9 gap-1 max-w-md mx-auto">
          <input
            v-for="(cell, index) in sudokuGrid"
            :key="index"
            v-model="sudokuGrid[index]"
            type="text"
            maxlength="1"
            class="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{
              'bg-gray-100 text-gray-700': initialSudokuGrid[index] !== '',
              'bg-white': initialSudokuGrid[index] === '',
              'border-r-4': (index + 1) % 3 === 0 && (index + 1) % 9 !== 0,
              'border-b-4': Math.floor(index / 9) % 3 === 2 && index < 72,
            }"
            :disabled="initialSudokuGrid[index] !== ''"
            @input="restrictInput($event, index); checkSudokuFilled()"
          />
        </div>
        <div class="mt-6 flex justify-center gap-4">
          <button
            @click="generateSudoku"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors"
          >
            Tạo bảng mới
          </button>
          <button
            @click="submitSudoku"
            class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            Submit
          </button>
          <button
            v-if="showSolveButton"
            @click="solveSudoku"
            class="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
          >
            Giải
          </button>
          <button
            @click="resetSudoku"
            class="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const activeTab = ref('guess-icon');
const tabs = [
  { id: 'guess-icon', label: 'Đoán Ý Từ Icon' },
  { id: 'sudoku', label: 'Sudoku' },
];

// --- Game Đoán Ý Từ 3 Icon ---
const gameData = ref([]);
const currentGame = ref({ icons: ['⏳', '⏳', '⏳'], answer: 'Đang tải...', options: ['Đang tải...'] });
const isGameFinished = ref(false);
const isCorrect = ref(false);
const isLoading = ref(true);
const playedIndices = ref([]);

async function fetchGameData() {
  try {
    const data = await $fetch('/api/riddles');
    gameData.value = data;
  } catch (error) {
    console.error('Error fetching game data:', error);
    gameData.value = await $fetch('/api/riddles');
    toast.error('Không thể tải câu đố từ API, dùng dữ liệu mẫu.', { position: 'top-center' });
  }
  isLoading.value = false;
  startNewGame();
}

function startNewGame() {
  if (playedIndices.value.length >= gameData.value.length) {
    playedIndices.value = [];
    toast.info('Đã hết câu đố, bắt đầu lại từ đầu!', { position: 'top-center' });
  }

  const availableIndices = gameData.value
    .map((_, index) => index)
    .filter(index => !playedIndices.value.includes(index));
  
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  currentGame.value = { ...gameData.value[randomIndex] };
  playedIndices.value.push(randomIndex);
  
  isGameFinished.value = false;
  isCorrect.value = false;
}

function checkAnswer(selectedOption) {
  isCorrect.value = selectedOption === currentGame.value.answer;
  isGameFinished.value = true;
}

// --- Sudoku ---
const sudokuGrid = ref([]);
const initialSudokuGrid = ref([]);
const solvedSudokuGrid = ref([]); // Lưu bảng đã giải
const isSudokuLoading = ref(true);
const showSolveButton = ref(false);

function generateSudoku() {
  isSudokuLoading.value = true;
  showSolveButton.value = false;
  const grid = Array(81).fill('');
  fillSudoku(grid, 0);
  solvedSudokuGrid.value = [...grid]; // Lưu bảng giải
  removeCells(grid, 40);
  sudokuGrid.value = grid;
  initialSudokuGrid.value = grid.map(cell => (cell === '' ? '' : cell));
  isSudokuLoading.value = false;
}

function fillSudoku(grid, pos) {
  if (pos === 81) return true;

  if (grid[pos] !== '') return fillSudoku(grid, pos + 1);

  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let num of numbers) {
    if (isSafe(grid, pos, num)) {
      grid[pos] = num.toString();
      if (fillSudoku(grid, pos + 1)) return true;
      grid[pos] = '';
    }
  }
  return false;
}

function isSafe(grid, pos, num) {
  const row = Math.floor(pos / 9);
  const col = pos % 9;

  for (let x = 0; x < 9; x++) {
    if (grid[row * 9 + x] === num.toString()) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (grid[x * 9 + col] === num.toString()) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[(startRow + i) * 9 + (startCol + j)] === num.toString()) return false;
    }
  }
  return true;
}

function removeCells(grid, count) {
  const positions = shuffleArray([...Array(81).keys()]);
  for (let i = 0; i < count; i++) {
    grid[positions[i]] = '';
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function solveSudoku() {
  sudokuGrid.value = [...solvedSudokuGrid.value];
  toast.success('Đáp án đã hiển thị!', { position: 'top-center' });
}

function resetSudoku() {
  sudokuGrid.value = [...initialSudokuGrid.value];
  showSolveButton.value = false;
}

function restrictInput(event, index) {
  const value = event.target.value;
  if (!/^[1-9]$/.test(value)) {
    sudokuGrid.value[index] = '';
  }
}

function checkSudokuFilled() {
  if (sudokuGrid.value.every(cell => cell !== '')) {
    submitSudoku();
  }
}

function submitSudoku() {
  const isCorrect = sudokuGrid.value.every((cell, index) => cell === solvedSudokuGrid.value[index]);
  if (isCorrect) {
    toast.success('Chính xác! Bạn đã giải đúng Sudoku! 🎉', { position: 'top-center' });
  } else {
    toast.error('Sai rồi! Xem đáp án nhé?', { position: 'top-center' });
    showSolveButton.value = true;
  }
}

// Khởi động
onMounted(async () => {
  await fetchGameData();
  generateSudoku();
});
</script>

<style scoped>
/* Không cần CSS vì đã dùng Tailwind */
</style>