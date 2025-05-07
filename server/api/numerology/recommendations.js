import { defineEventHandler, createError, readBody } from 'h3'
import { calculatePersonalDayNumber } from '../utils/numerology-calculations'
import { callGeminiApi } from '../utils/commonApi'

export default defineEventHandler(async (event) => {
  try {
    console.log('API /numerology/recommendations called')
    const body = await readBody(event)
    const { birthDate, category, foodPreferences, drinkPreferences } = body

    if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY'
      })
    }

    if (!['Đồ ăn', 'Đồ uống', 'Nhạc'].includes(category)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Danh mục không hợp lệ. Chọn Đồ ăn, Đồ uống hoặc Nhạc'
      })
    }

    // Calculate Personal Day Number
    const personalDayNumber = calculatePersonalDayNumber(birthDate)

    // Process user preferences
    const foodList = foodPreferences ? foodPreferences.split("'").map(item => item.trim()).filter(item => item) : []
    const drinkList = drinkPreferences ? drinkPreferences.split("'").map(item => item.trim()).filter(item => item) : []

    // Prepare prompt for Gemini API
    let prompt = ''
    let responseStructure = ''
    
    if (category === 'Đồ ăn') {
      prompt = `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý 5 món ăn phù hợp với năng lượng của số ${personalDayNumber}${
          foodList.length > 0 ? `, chọn từ danh sách sau: ${foodList.join(', ')}` : ''
        }.
        Trả về định dạng JSON thuần túy (không dùng Markdown):
        {
          "food": ["string", "string", "string", "string", "string"]
        }
      `
      responseStructure = 'food'
    } else if (category === 'Đồ uống') {
      prompt = `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý 5 loại đồ uống phù hợp với năng lượng của số ${personalDayNumber}${
          drinkList.length > 0 ? `, chọn từ danh sách sau: ${drinkList.join(', ')}` : ''
        }.
        Trả về định dạng JSON thuần túy (không dùng Markdown):
        {
          "drink": ["string", "string", "string", "string", "string"]
        }
      `
      responseStructure = 'drink'
    } else if (category === 'Nhạc') {
      prompt = `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý 5 bài hát, thể loại nhạc hoặc danh sách phát (playlists) phù hợp với năng lượng của số ${personalDayNumber}. 
        Mỗi gợi ý phải kèm link đến danh sách phát (playlist) trên YouTube hoặc Spotify nếu có, ưu tiên playlist hơn bài hát riêng lẻ. 
        Nếu không có playlist, cung cấp link bài hát hoặc null.
        Trả về định dạng JSON thuần túy (không dùng Markdown):
        {
          "music": [
            {"name": "string", "link": "string hoặc null"},
            {"name": "string", "link": "string hoặc null"},
            {"name": "string", "link": "string hoặc null"},
            {"name": "string", "link": "string hoặc null"},
            {"name": "string", "link": "string hoặc null"}
          ]
        }
      `
      responseStructure = 'music'
    }

    // Call Gemini API
    let geminiResponse
    try {
      geminiResponse = await callGeminiApi(prompt)
      console.log('Gemini API response:', geminiResponse)
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError.message)
      return getFallbackResponse(personalDayNumber, category, foodList, drinkList)
    }

    // Validate response
    if (!geminiResponse || !Array.isArray(geminiResponse[responseStructure])) {
      console.error('Invalid Gemini response:', geminiResponse)
      return getFallbackResponse(personalDayNumber, category, foodList, drinkList)
    }

    return {
      personalDayNumber,
      recommendations: geminiResponse
    }
  } catch (error) {
    console.error('Handler error:', error)
    throw createError({
      statusCode: error.statusCode || 400,
      statusMessage: error.message || 'Lỗi khi xử lý yêu cầu'
    })
  }
})

function getFallbackResponse(personalDayNumber, category, foodList, drinkList) {
  console.log('Using fallback response for personal day number:', personalDayNumber, 'category:', category)
  const defaultSuggestions = {
    1: {
      music: [
        { name: 'Pop năng động Playlist', link: 'https://www.youtube.com/playlist?list=PLw-VjHDlEOgv0N_6g8UbVq2ND7R0SAzkl' },
        { name: '"Happy" - Pharrell Williams', link: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs' },
        { name: 'Dance Pop Hits', link: 'https://open.spotify.com/playlist/37i9dQZF1DX6bnzK9KPvrz' },
        { name: '"Uptown Funk" - Mark Ronson ft. Bruno Mars', link: 'https://www.youtube.com/watch?v=OPf0YbXqDm0' },
        { name: 'Electronic Vibes', link: null }
      ],
      food: ['Phở bò', 'Bánh mì', 'Cơm gà', 'Bún riêu', 'Chả giò'],
      drink: ['Cà phê sữa', 'Nước cam', 'Trà đào', 'Sữa tươi', 'Nước dừa']
    },
    2: {
      music: [
        { name: 'Ballad nhẹ nhàng Playlist', link: 'https://www.youtube.com/playlist?list=PLDcW7ZwqO-DkM2G2uA1gJ3nLZmW8Q2zK5' },
        { name: '"Perfect" - Ed Sheeran', link: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g' },
        { name: 'Acoustic Chill', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7f4C' },
        { name: '"Let It Be" - The Beatles', link: 'https://www.youtube.com/watch?v=QDYfEBY9NM4' },
        { name: 'Soft Pop Hits', link: null }
      ],
      food: ['Bún chả', 'Gỏi cuốn', 'Canh chua', 'Bánh xèo', 'Nem chua'],
      drink: ['Trà đào', 'Nước chanh', 'Sữa đậu nành', 'Sinh tố bơ', 'Nước ép táo']
    },
    3: {
      music: [
        { name: 'Indie sáng tạo Playlist', link: 'https://www.youtube.com/playlist?list=PLw-VjHDlEOgthKTVvM3zX3VqV3qY3KX4J' },
        { name: '"Pumped Up Kicks" - Foster The People', link: 'https://www.youtube.com/watch?v=SDTZ7iX4vTQ' },
        { name: 'Alternative Hits', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4g8Gs5nPiEy' },
        { name: '"Ho Hey" - The Lumineers', link: 'https://www.youtube.com/watch?v=zvCBSSwgtg4' },
        { name: 'Folk Pop Vibes', link: null }
      ],
      food: ['Cơm tấm', 'Bánh cuốn', 'Mì Quảng', 'Chả cá', 'Bún bò Huế'],
      drink: ['Nước ép cam', 'Trà sữa', 'Sinh tố xoài', 'Nước mía', 'Cà phê đen']
    },
    4: {
      music: [
        { name: 'Classical thư giãn Playlist', link: 'https://www.youtube.com/playlist?list=PL2784D6EC7FB77D87' },
        { name: '"Clair de Lune" - Debussy', link: 'https://www.youtube.com/watch?v=CwzjlmBLfrQ' },
        { name: 'Piano Solo Classics', link: 'https://open.spotify.com/playlist/37i9dQZF1DWVqJtta02hlL' },
        { name: '"Moonlight Sonata" - Beethoven', link: 'https://www.youtube.com/watch?v=4Tr0otuiQuU' },
        { name: 'Orchestral Works', link: null }
      ],
      food: ['Hủ tiếu', 'Bánh canh', 'Cơm niêu', 'Lẩu mắm', 'Bánh ướt'],
      drink: ['Sữa tươi', 'Nước dừa', 'Trà xanh', 'Sinh tố dâu', 'Nước ép dứa']
    },
    5: {
      music: [
        { name: 'Rock sôi động Playlist', link: 'https://www.youtube.com/playlist?list=PLw-VjHDlEOgvJ4gW15rT3X4u1g0Hi5EgJ' },
        { name: '"Sweet Child O\' Mine" - Guns N\' Roses', link: 'https://www.youtube.com/watch?v=1w7OgIMMRc4' },
        { name: 'Punk Rock Classics', link: 'https://open.spotify.com/playlist/37i9dQZF1DXasneILDRM7L' },
        { name: '"Bohemian Rhapsody" - Queen', link: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' },
        { name: 'Grunge Anthems', link: null }
      ],
      food: ['Bún bò Huế', 'Phở gà', 'Cơm chiên', 'Mì xào', 'Gỏi ngó sen'],
      drink: ['Nước dừa', 'Cà phê đen', 'Trà sữa', 'Sinh tố chuối', 'Nước ép cà rốt']
    },
    6: {
      music: [
        { name: 'Jazz ấm áp Playlist', link: 'https://www.youtube.com/playlist?list=PLF38E5E3157EFD8A8' },
        { name: '"Fly Me to the Moon" - Frank Sinatra', link: 'https://www.youtube.com/watch?v=ZEcqHA7dbwM' },
        { name: 'Smooth Jazz Vibes', link: 'https://open.spotify.com/playlist/37i9dQZF1DX0H8hDpqH6oT' },
        { name: '"What a Wonderful World" - Louis Armstrong', link: 'https://www.youtube.com/watch?v=CWzrABouyeE' },
        { name: 'Bossa Nova Classics', link: null }
      ],
      food: ['Mì Quảng', 'Bánh xèo', 'Cá kho tộ', 'Gỏi gà', 'Bún nước lèo'],
      drink: ['Trà sữa', 'Nước chanh', 'Sinh tố xoài', 'Cà phê sữa', 'Nước ép táo']
    },
    7: {
      music: [
        { name: 'Ambient tĩnh lặng Playlist', link: 'https://www.youtube.com/playlist?list=PLMIbmfP_9vb8B5C2b8lIGp5r2eKruqFzE' },
        { name: '"Weightless" - Marconi Union', link: 'https://www.youtube.com/watch?v=UfcAVejs1cw' },
        { name: 'Chillout Lounge', link: 'https://open.spotify.com/playlist/37i9dQZF1DX2sQbnN89p4W' },
        { name: '"Spiegel im Spiegel" - Arvo Pärt', link: 'https://www.youtube.com/watch?v=QtFPdBUl7QY' },
        { name: 'Meditation Music', link: null }
      ],
      food: ['Bánh xèo', 'Gỏi cuốn', 'Canh chua', 'Bún chả', 'Nem chua'],
      drink: ['Nước chanh', 'Trà xanh', 'Sinh tố dâu', 'Nước ép cam', 'Sữa đậu nành']
    },
    8: {
      music: [
        { name: 'Hip-hop mạnh mẽ Playlist', link: 'https://www.youtube.com/playlist?list=PLw-VjHDlEOguqwW0gCwW' },
        { name: '"Lose Yourself" - Eminem', link: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s' },
        { name: 'Trap Bangers', link: 'https://open.spotify.com/playlist/37i9dQZF1DX0UrRvztWcAU' },
        { name: '"Sicko Mode" - Travis Scott', link: 'https://www.youtube.com/watch?v=6ONRf7h3Mdk' },
        { name: 'Rap Hits', link: null }
      ],
      food: ['Lẩu thái', 'Cơm tấm', 'Bánh mì', 'Phở bò', 'Bún riêu'],
      drink: ['Bia', 'Cà phê đen', 'Nước mía', 'Trà đào', 'Sinh tố bơ']
    },
    9: {
      music: [
        { name: 'World Music đa sắc Playlist', link: 'https://www.youtube.com/playlist?list=PLw-VjHDlEOguV5eQz7vXgJ' },
        { name: '"Waka Waka" - Shakira', link: 'https://www.youtube.com/watch?v=pRpeEdMmmQ0' },
        { name: 'Reggae Vibes', link: 'https://open.spotify.com/playlist/37i9dQZF1DXbSbnqxMTGx9' },
        { name: '"Three Little Birds" - Bob Marley', link: 'https://www.youtube.com/watch?v=zaGUr6wzyT8' },
        { name: 'Flamenco Passion', link: null }
      ],
      food: ['Gỏi cuốn', 'Bún bò Huế', 'Cơm gà', 'Bánh cuốn', 'Chả cá'],
      drink: ['Sinh tố xoài', 'Nước ép cam', 'Trà sữa', 'Nước chanh', 'Cà phê sữa']
    }
  }

  const suggestion = defaultSuggestions[personalDayNumber] || defaultSuggestions[9]
  let recommendations = {}

  if (category === 'Đồ ăn') {
    recommendations.food = foodList.length > 0 ? foodList.slice(0, 5) : suggestion.food
  } else if (category === 'Đồ uống') {
    recommendations.drink = drinkList.length > 0 ? drinkList.slice(0, 5) : suggestion.drink
  } else if (category === 'Nhạc') {
    recommendations.music = suggestion.music
  }

  return {
    personalDayNumber,
    recommendations
  }
}