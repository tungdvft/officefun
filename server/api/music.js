import { defineEventHandler } from 'h3'

// Hàm lấy token từ Spotify
async function getSpotifyToken() {
  const clientId = 'a142e884c4104625a8961db8c70c482b' // Thay bằng Client ID thật
  const clientSecret = '8a00ec905d124303b71bc1db94128397' // Thay bằng Client Secret thật

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lỗi lấy token Spotify:', response.status, errorText)
      throw new Error('Không thể lấy token Spotify')
    }

    const data = await response.json()
    console.log('Token Spotify:', data.access_token)
    return data.access_token
  } catch (error) {
    console.error('Lỗi trong getSpotifyToken:', error.message)
    throw error
  }
}

// Playlist theo ngày trong tuần
const dayToPlaylist = {
  1: { title: 'Monday Motivation', description: 'Start your week with positive energy!', query: 'monday motivation playlist' },
  2: { title: 'Tuesday Energy', description: 'Rock tunes to power through the week!', query: 'tuesday energy playlist' },
  3: { title: 'Midweek Vibes', description: 'Chill tracks for a balanced day.', query: 'wednesday chill playlist' },
  4: { title: 'Focus Thursday', description: 'Lo-fi beats to stay focused.', query: 'thursday focus playlist' },
  5: { title: 'Friday Chill', description: 'Relax into the weekend with chill vibes.', query: 'friday chill playlist' },
  6: { title: 'Saturday Party', description: 'Upbeat tracks to kick off the weekend!', query: 'saturday party playlist' },
  0: { title: 'Sunday Relaxation', description: 'Calm tunes for a restful Sunday.', query: 'sunday relaxation playlist' }
}

// Playlist theo vibe
const vibeToPlaylist = {
  'chill': { title: 'Chill Vibes', description: 'Relax with smooth, calming tunes.', query: 'chillout playlist' }, // Sửa query
  'party': { title: 'Party Mode', description: 'Get the party going with upbeat hits!', query: 'party mode playlist' },
  'focus': { title: 'Focus Flow', description: 'Instrumental beats for deep concentration.', query: 'focus flow playlist' },
  'energetic': { title: 'Energetic Boost', description: 'High-energy tracks to keep you moving!', query: 'energetic boost playlist' },
  'romantic': { title: 'Romantic Mood', description: 'Love songs for a cozy vibe.', query: 'romantic mood playlist' },
  'relax': { title: 'Relax & Unwind', description: 'Soothing music to de-stress.', query: 'relax unwind playlist' },
  'happy': { title: 'Happy Tunes', description: 'Feel-good songs to brighten your day!', query: 'happy tunes playlist' }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const vibe = query.vibe // Lấy vibe từ query (nếu có)
  const today = new Date().getDay()
  const playlistInfo = vibe ? vibeToPlaylist[vibe] : dayToPlaylist[today] // Ưu tiên vibe nếu có
  console.log('Query vibe:', vibe, 'Ngày hôm nay:', today, 'Playlist:', playlistInfo?.title || 'Không xác định')

  if (!playlistInfo) {
    console.warn('Không tìm thấy playlist info cho vibe:', vibe, 'hoặc ngày:', today)
    return {
      title: 'Invalid Playlist',
      description: 'Please choose a vibe or wait for a new day!',
      url: 'https://open.spotify.com/'
    }
  }

  try {
    const token = await getSpotifyToken()
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(playlistInfo.query)}&type=playlist&limit=1&market=VN`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lỗi response từ Spotify:', response.status, errorText)
      throw new Error('Lỗi tìm playlist từ Spotify')
    }

    const data = await response.json()
    console.log('Dữ liệu từ Spotify cho query:', playlistInfo.query, JSON.stringify(data.playlists?.items, null, 2))

    const playlist = data.playlists?.items[0]
    if (!playlist) {
      console.warn('Không tìm thấy playlist cho query:', playlistInfo.query)
      return {
        title: playlistInfo.title,
        description: playlistInfo.description,
        url: 'https://open.spotify.com/'
      }
    }

    return {
      title: playlistInfo.title,
      description: playlistInfo.description,
      url: playlist.external_urls.spotify
    }
  } catch (error) {
    console.error('Lỗi trong music.js:', error.message)
    return {
      title: playlistInfo.title,
      description: playlistInfo.description,
      url: 'https://open.spotify.com/'
    }
  }
})