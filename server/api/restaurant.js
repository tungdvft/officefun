export default defineEventHandler(async () => {
  const apiKey = 'YOUR_GOOGLE_API_KEY' // Thay key thật
  const lat = '21.0285' // Hà Nội mặc định
  const lon = '105.8542'
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&type=restaurant&radius=500&key=${apiKey}`)
    const data = await response.json()
    return {
      restaurantSuggestion: data.results[0] ? data.results[0].name : 'Chưa tìm thấy quán'
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return { restaurantSuggestion: 'Thử quán gần nhà mày đi!' }
  }
})