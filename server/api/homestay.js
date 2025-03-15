export default defineEventHandler(async (event) => {
  // Lấy kinh độ (lat) và vĩ độ (lon) từ query, mặc định là Mộc Châu (22.2871, 104.6167)
  const query = getQuery(event)
  const lat = query.lat ? parseFloat(query.lat) : 22.2871 // Vĩ độ Mộc Châu
  const lon = query.lon ? parseFloat(query.lon) : 104.6167 // Kinh độ Mộc Châu
  console.log('Tọa độ yêu cầu:', { lat, lon })

  // Bước 1: Tìm location ID từ Tripadvisor dựa trên tọa độ
  let locationId
  try {
    const locationResponse = await fetch(
      `https://tripadvisor1.p.rapidapi.com/locations/search?latLong=${lat},${lon}&limit=1`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '69c4c484e6mshc7cefdaec70cae4p1901fejsn025c0bb22856',
          'X-RapidAPI-Host': 'tripadvisor1.p.rapidapi.com'
        }
      }
    )

    if (!locationResponse.ok) {
      console.error('Lỗi response từ API location:', locationResponse.status, await locationResponse.text())
      throw new Error(`Lỗi tìm location: ${locationResponse.status}`)
    }

    const locationData = await locationResponse.json()
    console.log('Dữ liệu location từ API:', JSON.stringify(locationData, null, 2))

    locationId = locationData.data?.[0]?.result_object?.location_id
    if (!locationId) {
      console.warn('Không tìm thấy location_id cho tọa độ:', { lat, lon })
      return {
        homestaySuggestion: [{ name: `Không tìm thấy địa điểm gần tọa độ (${lat}, ${lon})`, rating: 0, reviews: 0, amenities: [], priceRange: 'N/A' }]
      }
    }
    console.log('Location ID:', locationId)
  } catch (error) {
    console.error('Lỗi khi tìm location ID:', error.message)
    return {
      homestaySuggestion: [{ name: 'Lỗi tìm kiếm địa điểm, thử lại sau!', rating: 0, reviews: 0, amenities: [], priceRange: 'N/A' }]
    }
  }

  // Bước 2: Tìm danh sách homestay theo location ID
  try {
    const homestayResponse = await fetch(
      `https://tripadvisor1.p.rapidapi.com/hotels/list?location_id=${locationId}&limit=5&sort=recommended&subcategory=homestay`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '69c4c484e6mshc7cefdaec70cae4p1901fejsn025c0bb22856',
          'X-RapidAPI-Host': 'tripadvisor1.p.rapidapi.com'
        }
      }
    )

    if (!homestayResponse.ok) {
      console.error('Lỗi response từ API homestay:', homestayResponse.status, await homestayResponse.text())
      throw new Error(`Lỗi lấy danh sách homestay: ${homestayResponse.status}`)
    }

    const homestayData = await homestayResponse.json()
    console.log('Dữ liệu homestay từ API:', JSON.stringify(homestayData, null, 2))

    const homestays = homestayData.data || []

    // Bước 3: Xử lý và sắp xếp dữ liệu
    const formattedHomestays = homestays
      .map(hotel => ({
        name: hotel.name || 'Homestay không tên',
        rating: parseFloat(hotel.rating) || 0,
        reviews: parseInt(hotel.num_reviews) || 0,
        amenities: hotel.amenities?.slice(0, 3) || ['Không có thông tin'],
        priceRange: hotel.price || 'Chưa rõ giá'
      }))
      .sort((a, b) => b.rating - a.rating)

    if (formattedHomestays.length === 0) {
      console.warn('Không có homestay nào gần tọa độ:', { lat, lon })
      return {
        homestaySuggestion: [{ name: `Không tìm thấy homestay gần (${lat}, ${lon})`, rating: 0, reviews: 0, amenities: [], priceRange: 'N/A' }]
      }
    }

    return { homestaySuggestion: formattedHomestays }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách homestay:', error.message)
    return {
      homestaySuggestion: [{ name: 'Lỗi hệ thống, thử lại sau!', rating: 0, reviews: 0, amenities: [], priceRange: 'N/A' }]
    }
  }
})