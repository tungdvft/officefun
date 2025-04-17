import { useFetch } from '#app'

export const useTokenDeduction = () => {
  const deductTokens = async (userId) => {
    // Kiểm tra userId
    if (!userId) {
      console.error('deductTokens: userId is missing or invalid', { userId })
      return {
        success: false,
        message: 'Invalid userId: User must be logged in'
      }
    }

    try {
      console.log('deductTokens: Sending request with userId:', userId)
      const { data, error } = await useFetch('/api/deduct', {
        method: 'POST',
        body: {
          userId,
          amount: 10
        }
      })

      if (error.value) {
        console.error('deductTokens: API error:', error.value)
        throw new Error('Failed to deduct tokens: ' + error.value.message)
      }

      return {
        success: true,
        message: 'Deducted 10 tokens successfully',
        remainingTokens: data.value?.remainingTokens
      }
    } catch (err) {
      console.error('deductTokens: Caught error:', err)
      return {
        success: false,
        message: err.message
      }
    }
  }

  return { deductTokens }
}