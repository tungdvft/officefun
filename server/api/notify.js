import { defineEventHandler } from 'h3'
import crypto from 'crypto'

const SECRET_KEY = 'YOUR_MOMO_SECRET_KEY'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { orderId, resultCode } = body

  const rawSignature = `accessKey=${body.accessKey}&amount=${body.amount}&message=${body.message}&orderId=${orderId}&orderInfo=${body.orderInfo}&orderType=${body.orderType}&partnerCode=${body.partnerCode}&payType=${body.payType}&requestId=${body.requestId}&responseTime=${body.responseTime}&resultCode=${resultCode}&transId=${body.transId}`
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(rawSignature).digest('hex')

  if (signature !== body.signature) {
    throw createError({ statusCode: 400, message: 'Invalid signature' })
  }

  if (resultCode === 0) {
    const username = orderId.split('_')[1]
    localStorage.setItem(`premium_${username}`, JSON.stringify({
      status: 'active',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 ngày
    }))
  }

  return { status: 'OK' }
})