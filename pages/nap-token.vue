<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 text-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-1/4 w-32 h-32 bg-purple-300 rounded-full filter blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-40 h-40 bg-indigo-300 rounded-full filter blur-3xl"></div>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white relative z-10">Nạp Token</h1>
          <p class="text-purple-100 mt-2 text-sm sm:text-base relative z-10">
            Nạp token để trải nghiệm các tính năng độc quyền của Thần Số Học Toàn Diện
          </p>
        </div>

        <!-- Main content -->
        <div class="p-6 sm:p-8">
          <!-- Package selection header -->
          <div class="text-center mb-8 relative">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50"></div>
            <h2 class="text-xl sm:text-2xl font-bold text-purple-800 mb-2 relative">
              <span class="bg-white px-4 relative">Chọn gói phù hợp với bạn</span>
            </h2>
            <p class="text-gray-600 max-w-lg mx-auto mt-4">
              Các gói token được thiết kế để đáp ứng mọi nhu cầu khám phá thần số học của bạn
            </p>
          </div>

          <!-- Package grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div 
              v-for="(pkg, key) in packages" 
              :key="key"
              @click="selectPackage(key)"
              :class="{
                'border-2 border-purple-500 ring-4 ring-purple-100 shadow-lg': selectedPackage === key,
                'border border-gray-200 hover:border-purple-300': selectedPackage !== key
              }"
              class="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1 cursor-pointer flex flex-col min-h-[380px] relative"
            >
              <div v-if="pkg.badge" class="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg transform rotate-6 shadow-sm">
                {{ pkg.badge }}
              </div>
              
              <h3 class="text-lg font-semibold text-gray-800">{{ pkg.name }}</h3>
              <p class="text-2xl font-bold text-purple-600 mt-2">{{ pkg.price }}</p>
              <p class="text-gray-600 mt-1 text-sm">{{ pkg.tokens }}</p>
              
              <div v-if="pkg.saving" class="mt-2 text-xs bg-green-50 text-green-600 rounded-full px-2 py-1 inline-block">
                Tiết kiệm {{ pkg.saving }}
              </div>
              
              <ul class="text-gray-600 text-sm mt-4 text-left flex-1 space-y-2">
                <li v-for="(feature, index) in pkg.features" :key="index" class="flex items-start">
                  <svg class="flex-shrink-0 w-4 h-4 text-purple-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              
              <button 
                :class="{
                  'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md': selectedPackage === key,
                  'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600': selectedPackage !== key
                }"
                class="mt-auto w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
              >
                {{ selectedPackage === key ? 'Đã chọn' : 'Chọn gói' }}
                <svg v-if="selectedPackage === key" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Payment section (ref added here) -->
          <div ref="paymentSection" class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-100">
            <h3 class="text-lg font-semibold text-purple-800 mb-4 text-center relative">
              <span class="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 relative z-10">Thông tin thanh toán</span>
              <div class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent z-0"></div>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
                  </svg>
                  Thanh toán bằng QR Code
                </h4>
                
                <div class="mt-4 flex flex-col items-center">
                  <img src="/qrcode.png" alt="Qr code" />
                  <p class="text-sm text-gray-500 mt-3 text-center">
                    Quét mã QR để thanh toán nhanh qua ứng dụng ngân hàng
                  </p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Chuyển khoản ngân hàng
                  </h4>
                  
                  <div class="space-y-3">
                    <div>
                      <p class="text-sm text-gray-500">Ngân hàng:</p>
                      <p class="font-medium text-gray-800">Vietcombank</p>
                    </div>
                    
                    <div>
                      <p class="text-sm text-gray-500">Số tài khoản:</p>
                      <div class="flex items-center">
                        <p class="font-medium text-gray-800 mr-2">{{ bankDetails.accountNumber }}</p>
                        <button @click="copyToClipboard(bankDetails.accountNumber)" class="text-purple-600 hover:text-purple-800">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p class="text-sm text-gray-500">Chủ tài khoản:</p>
                      <p class="font-medium text-gray-800">{{ bankDetails.accountName }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"/>
                    </svg>
                    Nội dung chuyển khoản
                  </h4>
                  
                  <div class="relative">
                    <input 
                      :value="transferSyntax" 
                      ref="syntaxInput"
                      type="text" 
                      readonly 
                      class="w-full bg-gray-50 border border-gray-300 text-gray-700 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 font-medium"
                    >
                    <button 
                      @click="copySyntax"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-md transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-sm text-gray-500 mt-2">Sao chép nội dung này khi chuyển khoản để được xử lý nhanh nhất</p>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <h4 class="font-medium text-blue-800">Lưu ý quan trọng</h4>
                  <p class="text-sm text-blue-600 mt-1">
                    Sau khi chuyển khoản, HÃY nhắn qua Zalo admin: <span class="font-semibold">0968 263 866</span> để được xác nhận nạp token.
                    Token của bạn sẽ được thêm vào ngay sau khi admin xác nhận thành công.
                    Nếu cần hỗ trợ hoặc đặt câu hỏi, vui lòng liên hệ qua email <span class="font-semibold">info.auratrust@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showToast"
        class="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-xs"
      >
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span class="text-sm">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

// Refs
const selectedPackage = ref('value')
const showToast = ref(false)
const toastMessage = ref('')
const qrCanvas = ref(null)
const qrError = ref('')
const syntaxInput = ref(null)
const paymentSection = ref(null)

// Data
const packages = {
  starter: {
    name: 'Starter Pack',
    price: '25.000₫',
    tokens: '100 token',
    amount: 25000,
    features: [
      'Đủ để dùng thêm 2–3 tính năng sau khi hết token miễn phí',
      'Khám phá chuyên sâu hơn về bản thân hoặc mối quan hệ đầu tiên',
      'Phù hợp cho người mới bắt đầu & muốn thử thêm tính năng'
    ]
  },
  value: {
    name: 'Value Pack',
    price: '60.000₫',
    tokens: '300 token',
    amount: 60000,
    badge: 'PHỔ BIẾN',
    saving: '20%',
    features: [
      'Gấp 3 lần Starter nhưng tiết kiệm hơn 20%',
      'Dùng được nhiều tính năng nâng cao',
      'Phù hợp cho người tìm hiểu chuyên sâu'
    ]
  },
  mega: {
    name: 'Mega Pack',
    price: '180.000₫',
    tokens: '1.000 token',
    amount: 180000,
    saving: '28%',
    features: [
      'Đủ để dùng gần như toàn bộ hệ thống trong vài tháng',
      'Trải nghiệm mọi tính năng nâng cao',
      'Hỗ trợ phân tích nhiều người',
      'Thích hợp cho việc chia sẻ, tư vấn'
    ]
  },
  combo: {
    name: 'Combo Exam',
    price: '99.000₫',
    tokens: '500 token + PDF Hướng Nghiệp',
    amount: 99000,
    features: [
      '500 token + tặng báo cáo chọn ngành học bản PDF',
      'Hỗ trợ định hướng nghề nghiệp, chọn trường',
      'PDF Hướng Nghiệp có đủ 6 nghề nghiệp phù hợp',
      'Phù hợp cho các bạn trẻ chuẩn bị chọn ngành học'
    ]
  }
}

const bankDetails = {
  accountNumber: '1023969324',
  accountName: 'PHAN MINH HUONG',
  bankCode: 'VCB',
  branch: 'Chi nhánh Hà Nội'
}

// Computed
const transferSyntax = computed(() => {
  return packages[selectedPackage.value].name
})

// Methods
const selectPackage = async (pkg) => {
  selectedPackage.value = pkg
  qrError.value = ''
  
  // Wait for next tick to ensure DOM is updated
  await nextTick()
  
  // Scroll to payment section with smooth behavior
  if (paymentSection.value) {
    paymentSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    // Optional: Add a small offset
    // window.scrollBy(0, -20)
  }
}

const copySyntax = () => {
  if (syntaxInput.value) {
    syntaxInput.value.select()
    document.execCommand('copy')
    showToastMessage('Đã sao chép nội dung chuyển khoản!')
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  showToastMessage('Đã sao chép số tài khoản!')
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const generateQRCode = () => {
  if (!qrCanvas.value) return
  
  const pkg = packages[selectedPackage.value]
  const accountInfo = `${bankDetails.accountName}|${bankDetails.accountNumber}|${bankDetails.bankCode}`
  const amount = pkg.amount
  const note = `${pkg.name} - ${bankDetails.accountName}`
  
  const qrContent = `bank://transfer?account=${bankDetails.accountNumber}&name=${encodeURIComponent(bankDetails.accountName)}&amount=${amount}&message=${encodeURIComponent(note)}`
  
  QRCode.toCanvas(qrCanvas.value, qrContent, 
    { 
      width: 200,
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#4F46E5',
        light: '#FFFFFF'
      }
    }, 
    (error) => {
      if (error) {
        console.error('QR generation error:', error)
        qrError.value = 'Không thể tạo mã QR. Vui lòng thử lại.'
      }
    }
  )
}

// Lifecycle hooks
onMounted(() => {
  generateQRCode()
})

watch(selectedPackage, () => {
  generateQRCode()
})
</script>

<style scoped>
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
  background: #c7d2fe;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}

/* Animation for package selection */
.ring-purple-100 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(216, 180, 254, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(216, 180, 254, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(216, 180, 254, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .min-h-\[380px\] {
    min-height: 420px;
  }
  
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>