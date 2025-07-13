<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 text-center">
          <h1 class="text-2xl sm:text-3xl font-bold text-white">Nạp Token</h1>
          <p class="text-purple-100 mt-2 text-sm sm:text-base">
            Nạp token để trải nghiệm các tính năng độc quyền của Thần Số Học Toàn Diện
          </p>
        </div>

        <!-- Main content -->
        <div class="p-6 sm:p-8">
          <!-- Package selection -->
          <div class="text-center mb-8">
            <h2 class="text-xl sm:text-2xl font-bold text-purple-800 mb-2">Chọn gói phù hợp với bạn</h2>
            <p class="text-gray-600 max-w-lg mx-auto">
              Các gói token được thiết kế để đáp ứng mọi nhu cầu khám phá thần số học của bạn
            </p>
          </div>

          <!-- Package grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <!-- Starter Pack -->
            <div 
              @click="selectPackage('starter')"
              :class="{'border-2 border-purple-500 ring-2 ring-purple-200': selectedPackage === 'starter', 'border border-gray-200': selectedPackage !== 'starter'}"
              class="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:transform hover:-translate-y-1 cursor-pointer flex flex-col min-h-[250px]"
            >
              <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Starter Pack</h3>
              <p class="text-2xl font-bold text-purple-600 mt-2">25.000₫</p>
              <p class="text-gray-600 mt-1 text-sm">100 token</p>
              <button 
                :class="{'bg-gradient-to-r from-purple-600 to-indigo-600': selectedPackage === 'starter', 'bg-gradient-to-r from-purple-500 to-indigo-500': selectedPackage !== 'starter'}"
                class="mt-auto w-full text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-200"
              >
                {{ selectedPackage === 'starter' ? 'Đang chọn' : 'Chọn gói' }}
              </button>
            </div>

            <!-- Value Pack -->
            <div 
              @click="selectPackage('value')"
              :class="{'border-2 border-purple-500 ring-2 ring-purple-200': selectedPackage === 'value', 'border border-gray-200': selectedPackage !== 'value'}"
              class="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:transform hover:-translate-y-1 cursor-pointer flex flex-col min-h-[250px]"
            >
              <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Value Pack</h3>
              <p class="text-2xl font-bold text-purple-600 mt-2">60.000₫</p>
              <p class="text-gray-600 mt-1 text-sm">300 token</p>
              <button 
                :class="{'bg-gradient-to-r from-purple-600 to-indigo-600': selectedPackage === 'value', 'bg-gradient-to-r from-purple-500 to-indigo-500': selectedPackage !== 'value'}"
                class="mt-auto w-full text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-200"
              >
                {{ selectedPackage === 'value' ? 'Đang chọn' : 'Chọn gói' }}
              </button>
            </div>

            <!-- Mega Pack -->
            <div 
              @click="selectPackage('mega')"
              :class="{'border-2 border-purple-500 ring-2 ring-purple-200': selectedPackage === 'mega', 'border border-gray-200': selectedPackage !== 'mega'}"
              class="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:transform hover:-translate-y-1 cursor-pointer relative flex flex-col min-h-[250px]"
            >
              <div class="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                PHỔ BIẾN
              </div>
              <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Mega Pack</h3>
              <p class="text-2xl font-bold text-purple-600 mt-2">180.000₫</p>
              <p class="text-gray-600 mt-1 text-sm">1.000 token</p>
              <button 
                :class="{'bg-gradient-to-r from-purple-600 to-indigo-600': selectedPackage === 'mega', 'bg-gradient-to-r from-purple-500 to-indigo-500': selectedPackage !== 'mega'}"
                class="mt-auto w-full text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-200"
              >
                {{ selectedPackage === 'mega' ? 'Đang chọn' : 'Chọn gói' }}
              </button>
            </div>

            <!-- Zen+ Membership -->
            <div 
              @click="selectPackage('zen')"
              :class="{'border-2 border-purple-500 ring-2 ring-purple-200': selectedPackage === 'zen', 'border border-gray-200': selectedPackage !== 'zen'}"
              class="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:transform hover:-translate-y-1 cursor-pointer flex flex-col min-h-[250px]"
            >
              <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Zen+ Membership</h3>
              <p class="text-2xl font-bold text-purple-600 mt-2">129.000₫<span class="text-sm font-normal text-gray-500">/tháng</span></p>
              <p class="text-gray-600 mt-1 text-sm">Unlimited Daily + 200 token</p>
              <button 
                :class="{'bg-gradient-to-r from-purple-600 to-indigo-600': selectedPackage === 'zen', 'bg-gradient-to-r from-purple-500 to-indigo-500': selectedPackage !== 'zen'}"
                class="mt-auto w-full text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-200"
              >
                {{ selectedPackage === 'zen' ? 'Đang chọn' : 'Chọn gói' }}
              </button>
            </div>
          </div>

          <!-- Payment information -->
          <div class="bg-purple-50 rounded-xl p-6 mb-8">
            <h3 class="text-lg font-semibold text-purple-800 mb-4 text-center">Thông tin chuyển khoản</h3>
            
            <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h4 class="font-medium text-gray-800 mb-2 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Ngân hàng Vietcombank
              </h4>
              <p class="text-gray-700 mt-2">Số tài khoản: <span class="font-medium">{{ bankDetails.accountNumber }}</span></p>
              <p class="text-gray-700">Chủ tài khoản: <span class="font-medium">{{ bankDetails.accountName }}</span></p>
              <p class="text-gray-700">Chi nhánh: <span class="font-medium">{{ bankDetails.branch }}</span></p>
            </div>

            <!-- Transfer syntax -->
            <div class="bg-white p-4 rounded-lg shadow-sm relative mb-4">
              <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
                Cú pháp chuyển khoản
              </h4>
              <div class="relative">
                <input 
                  :value="transferSyntax" 
                  ref="syntaxInput"
                  type="text" 
                  readonly 
                  class="w-full bg-gray-50 border border-gray-300 text-gray-700 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
                >
                <button 
                  @click="copySyntax"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-md transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-2">Sao chép cú pháp này khi chuyển khoản để được xử lý nhanh nhất</p>
            </div>

            <!-- QR Code -->
            <div class="bg-white p-4 rounded-lg shadow-sm text-center">
              <h4 class="font-medium text-gray-800 mb-3 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m-3 0h-2m-2 4h-2m2 4h2m-6 0h2m6-4h2m-2-4h2m-6 0h2m-2 4h2"></path>
                </svg>
                Quét mã QR để thanh toán
              </h4>
              <canvas ref="qrCanvas" class="mx-auto"></canvas>
              <p v-if="qrError" class="text-sm text-red-500 mt-2">{{ qrError }}</p>
              <p class="text-sm text-gray-500 mt-2">Quét mã QR này bằng ứng dụng Vietcombank Digibank để tự động điền thông tin chuyển khoản</p>
            </div>

            <!-- Toast Notification -->
            <div 
              v-if="showToast"
              class="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Đã sao chép cú pháp chuyển khoản!
            </div>

            <div class="mt-4 text-center text-sm text-gray-600">
              Sau khi chuyển khoản, vui lòng liên hệ hỗ trợ qua email <span class="text-purple-600">support@luangiaithanso.com</span> hoặc Zalo <span class="text-purple-600">0123456789</span> để được xác nhận nạp token.
            </div>
          </div>

          <!-- Back button -->
          <div class="text-center">
            <a href="/xem" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg">
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Quay lại Trang Chính
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

const selectedPackage = ref('mega') // Mặc định chọn Mega Pack
const showToast = ref(false) // Biến kiểm soát hiển thị toast
const qrCanvas = ref(null) // Ref cho canvas hiển thị mã QR
const qrError = ref('') // Biến lưu thông báo lỗi mã QR

const packages = {
  starter: {
    name: 'STARTER PACK',
    price: '25.000₫',
    tokens: '100 token',
    amount: 25000 // Số tiền bằng VND (không có dấu chấm)
  },
  value: {
    name: 'VALUE PACK',
    price: '60.000₫',
    tokens: '300 token',
    amount: 60000
  },
  mega: {
    name: 'MEGA PACK',
    price: '180.000₫',
    tokens: '1.000 token',
    amount: 180000
  },
  zen: {
    name: 'ZEN MEMBERSHIP',
    price: '129.000₫/tháng',
    tokens: 'Unlimited Daily + 200 token',
    amount: 129000
  }
}

const bankDetails = {
  accountNumber: '0021000317551', // Số tài khoản Vietcombank thực
  accountName: 'DO VIET TUNG', // Tên chủ tài khoản thực, viết hoa, không dấu
  bankCode: 'VCB', // Mã ngân hàng Vietcombank cho VietQR
  template: 'compact', // Template VietQR
  branch: 'Hà Nội' // Chi nhánh
}

// Định nghĩa transferSyntax để tạo nội dung chuyển khoản
const transferSyntax = computed(() => {
  return packages[selectedPackage.value].name
})

// Hàm tạo CRC16 (theo chuẩn VietQR)
const crc16 = (data) => {
  let crc = 0xFFFF
  const polynomial = 0x1021
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc <<= 1
      }
    }
  }
  return (crc & 0xFFFF).toString(16).padStart(4, '0').toUpperCase()
}

// Định dạng VietQR theo chuẩn Napas
const qrData = computed(() => {
  const pkg = packages[selectedPackage.value]
  const accountNo = bankDetails.accountNumber
  const accountName = bankDetails.accountName.replace(/\s/g, '').toUpperCase()
  const amount = pkg.amount.toString()
  const note = transferSyntax.value.replace(/\s/g, '')

  // Định dạng VietQR
  const payload = [
    '000201', // Version
    '010212', // Method (dynamic QR)
    `38${(38 + accountNo.length + accountName.length).toString().padStart(2, '0')}`, // Merchant Account Info
    `0010A000000727`, // Merchant Account Info Template
    `01${(28 + accountNo.length + accountName.length).toString().padStart(2, '0')}`, // Merchant Account Info Sub-template
    `00${bankDetails.bankCode.length.toString().padStart(2, '0')}${bankDetails.bankCode}`, // Bank Code
    `01${accountNo.length.toString().padStart(2, '0')}${accountNo}`, // Account Number
    `02${accountName.length.toString().padStart(2, '0')}${accountName}`, // Account Name
    '5303704', // Currency (VND)
    `54${amount.length.toString().padStart(2, '0')}${amount}`, // Amount
    '5802VN', // Country Code
    `62${(8 + note.length).toString().padStart(2, '0')}`, // Additional Data
    `08${note.length.toString().padStart(2, '0')}${note}`, // Transaction Note
    `6304` // CRC (sẽ được thêm sau)
  ].join('')

  const crc = crc16(payload)
  console.log('VietQR Payload:', `${payload}${crc}`) // Debug payload
  return `${payload}${crc}`
})

const syntaxInput = ref(null)

const selectPackage = (pkg) => {
  selectedPackage.value = pkg
  qrError.value = '' // Xóa lỗi khi chọn gói mới
}

const copySyntax = () => {
  if (syntaxInput.value) {
    syntaxInput.value.select()
    document.execCommand('copy')
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000) // Ẩn toast sau 3 giây
  }
}

const generateQRCode = () => {
  qrError.value = ''
  // Kiểm tra số tài khoản
  if (!bankDetails.accountNumber || bankDetails.accountNumber === 'YOUR_ACTUAL_VIETCOMBANK_ACCOUNT_NUMBER') {
    qrError.value = 'Vui lòng cung cấp số tài khoản Vietcombank hợp lệ'
    return
  }
  if (!/^\d+$/.test(bankDetails.accountNumber) || bankDetails.accountNumber.length < 10) {
    qrError.value = 'Số tài khoản không hợp lệ, vui lòng kiểm tra lại'
    return
  }
  // Kiểm tra tên chủ tài khoản
  if (!bankDetails.accountName || bankDetails.accountName === 'YOUR_ACTUAL_ACCOUNT_NAME' || bankDetails.accountName.trim() === '') {
    qrError.value = 'Vui lòng cung cấp tên chủ tài khoản hợp lệ'
    return
  }
  // Kiểm tra số tiền
  if (!packages[selectedPackage.value].amount || packages[selectedPackage.value].amount <= 0) {
    qrError.value = 'Số tiền không hợp lệ, vui lòng chọn gói khác'
    return
  }
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, qrData.value, { width: 200, errorCorrectionLevel: 'H' }, (error) => {
      if (error) {
        qrError.value = 'Lỗi khi tạo mã QR, vui lòng thử lại'
        console.error('Lỗi khi tạo mã QR:', error)
      }
    })
  }
}

// Tạo mã QR khi component được mount và khi selectedPackage thay đổi
onMounted(generateQRCode)
watch(selectedPackage, generateQRCode)
</script>

<style scoped>
.container {
  min-height: calc(100vh - 64px);
}

/* Animation for package cards */
.hover\:transform:hover {
  transform: translateY(-4px);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Toast animation */
.fixed {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .p-6, .p-8 {
    padding: 1.25rem;
  }

  .fixed {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>