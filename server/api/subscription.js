import { defineEventHandler } from 'h3'
import crypto from 'crypto'
import fetch from 'node-fetch'

const PARTNER_CODE = 'YOUR_MOMO_PARTNER_CODE'
const ACCESS_KEY = 'YOUR_MOMO_ACCESS_KEY'
const SECRET_KEY = 'YOUR_MOMO_SECRET_KEY'
const RETURN_URL = 'http://localhost:3000/success'
const NOTIFY_URL = 'http://localhost:3000/api/notify' // Callback từ MoMo

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username']
  if (!username) throw createError({ statusCode: 400, message: 'Thiếu username' })

  const orderId = `PREMIUM_${username}_${Date.now()}`
  const amount = 200000 // 200k VND
  const requestType = 'payWithMoMo' // Thanh toán một lần, sau này đổi thành subscription

  const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=&orderId=${orderId}&orderInfo=Gói Premium 200k/tháng&partnerCode=${PARTNER_CODE}&redirectUrl=${RETURN_URL}&requestId=${orderId}&requestType=${requestType}`
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(rawSignature).digest('hex')

  const body = {
    partnerCode: PARTNER_CODE,
    accessKey: ACCESS_KEY,
    requestId: orderId,
    amount: amount.toString(),
    orderId: orderId,
    orderInfo: 'Gói Premium 200k/tháng',
    redirectUrl: RETURN_URL,
    notifyUrl: NOTIFY_URL,
    requestType: requestType,
    signature: signature
  }

  try {
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (data.resultCode === 0) {
      return { url: data.payUrl }
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Lỗi tạo thanh toán MoMo:', error)
    throw createError({ statusCode: 500, message: 'Lỗi thanh toán' })
  }
})