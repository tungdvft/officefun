import { defineEventHandler, readBody, createError } from 'h3';
import { setupDatabase } from '../db/sqlite.js';

// Ý nghĩa mặc định cho tất cả 78 lá bài (dùng làm fallback)
const defaultMeanings = {
  'The Fool': 'Hành trình mới bắt đầu, sự ngây thơ và tự do.',
  'The Magician': 'Khả năng biến ý tưởng thành hiện thực, kỹ năng và tự tin.',
  'The High Priestess': 'Trực giác sâu sắc, bí ẩn và sự tĩnh lặng.',
  'The Empress': 'Sự sáng tạo, nuôi dưỡng và phong phú.',
  'The Emperor': 'Quyền lực, cấu trúc và sự kiểm soát.',
  'The Hierophant': 'Truyền thống, học hỏi và hướng dẫn tinh thần.',
  'The Lovers': 'Tình yêu, sự lựa chọn và hợp nhất.',
  'The Chariot': 'Ý chí mạnh mẽ, chiến thắng qua quyết tâm.',
  'Strength': 'Sức mạnh nội tại, lòng can đảm và kiên nhẫn.',
  'The Hermit': 'Tìm kiếm sự thật, cô độc và nội tâm.',
  'Wheel of Fortune': 'Chu kỳ thay đổi, vận may và định mệnh.',
  'Justice': 'Công bằng, sự thật và hậu quả.',
  'The Hanged Man': 'Hy sinh, buông bỏ và nhìn nhận mới.',
  'Death': 'Kết thúc để bắt đầu, sự chuyển đổi lớn.',
  'Temperance': 'Cân bằng, hài hòa và kiên nhẫn.',
  'The Devil': 'Cám dỗ, ràng buộc và dục vọng.',
  'The Tower': 'Sụp đổ đột ngột, sự thật phơi bày.',
  'The Star': 'Hy vọng, cảm hứng và chữa lành.',
  'The Moon': 'Ảo tưởng, sợ hãi và tiềm thức.',
  'The Sun': 'Niềm vui, thành công và ánh sáng.',
  'Judgement': 'Tái sinh, đánh giá và thức tỉnh.',
  'The World': 'Hoàn thành, viên mãn và kết nối toàn cầu.',
  'Ace of Wands': 'Khởi đầu sáng tạo, đam mê và năng lượng mới.',
  'Two of Wands': 'Lập kế hoạch, lựa chọn và khám phá tương lai.',
  'Three of Wands': 'Tầm nhìn xa, chờ đợi thành quả.',
  'Four of Wands': 'Lễ kỷ niệm, sự ổn định và niềm vui gia đình.',
  'Five of Wands': 'Xung đột, cạnh tranh và thử thách.',
  'Six of Wands': 'Chiến thắng, công nhận và thành công.',
  'Seven of Wands': 'Bảo vệ, kiên định trước áp lực.',
  'Eight of Wands': 'Nhanh chóng, tiến triển và hành động quyết liệt.',
  'Nine of Wands': 'Kiên cường, phòng thủ và sức bền.',
  'Ten of Wands': 'Gánh nặng, trách nhiệm quá lớn.',
  'Page of Wands': 'Khám phá, nhiệt huyết và tin tức mới.',
  'Knight of Wands': 'Hành động táo bạo, đam mê và phiêu lưu.',
  'Queen of Wands': 'Tự tin, độc lập và sáng tạo.',
  'King of Wands': 'Lãnh đạo, tầm nhìn và quyết đoán.',
  'Ace of Cups': 'Tình cảm dâng trào, khởi đầu tình yêu.',
  'Two of Cups': 'Hợp tác, kết nối sâu sắc giữa hai người.',
  'Three of Cups': 'Niềm vui, tình bạn và lễ kỷ niệm.',
  'Four of Cups': 'Thờ ơ, bất mãn và cơ hội bị bỏ qua.',
  'Five of Cups': 'Mất mát, tiếc nuối và tập trung vào tiêu cực.',
  'Six of Cups': 'Ký ức tuổi thơ, hoài niệm và sự ngây thơ.',
  'Seven of Cups': 'Ảo tưởng, nhiều lựa chọn và mơ mộng.',
  'Eight of Cups': 'Rời bỏ, tìm kiếm ý nghĩa sâu hơn.',
  'Nine of Cups': 'Hài lòng, ước mơ thành hiện thực.',
  'Ten of Cups': 'Hạnh phúc gia đình, hòa hợp lâu dài.',
  'Page of Cups': 'Cảm xúc mới, thông điệp tình cảm.',
  'Knight of Cups': 'Lãng mạn, theo đuổi giấc mơ tình yêu.',
  'Queen of Cups': 'Nhạy cảm, trực giác và chăm sóc.',
  'King of Cups': 'Kiểm soát cảm xúc, lòng trắc ẩn.',
  'Ace of Swords': 'Sự rõ ràng, sức mạnh tinh thần.',
  'Two of Swords': 'Bế tắc, quyết định khó khăn.',
  'Three of Swords': 'Đau lòng, tổn thương và chia ly.',
  'Four of Swords': 'Nghỉ ngơi, hồi phục và tĩnh lặng.',
  'Five of Swords': 'Thắng bằng mọi giá, xung đột ích kỷ.',
  'Six of Swords': 'Chuyển đổi, rời xa khó khăn.',
  'Seven of Swords': 'Lừa dối, chiến lược và trốn tránh.',
  'Eight of Swords': 'Tù túng, tự hạn chế bản thân.',
  'Nine of Swords': 'Lo âu, ác mộng và căng thẳng.',
  'Ten of Swords': 'Kết thúc đau đớn, sự phản bội.',
  'Page of Swords': 'Tò mò, tư duy sắc bén.',
  'Knight of Swords': 'Hành động nhanh, quyết liệt và logic.',
  'Queen of Swords': 'Độc lập, trung thực và rõ ràng.',
  'King of Swords': 'Quyền lực trí tuệ, công bằng.',
  'Ace of Pentacles': 'Cơ hội tài chính, khởi đầu thịnh vượng.',
  'Two of Pentacles': 'Cân bằng, quản lý nhiều việc.',
  'Three of Pentacles': 'Hợp tác, kỹ năng được công nhận.',
  'Four of Pentacles': 'Kiểm soát, giữ chặt tài sản.',
  'Five of Pentacles': 'Khó khăn tài chính, cảm giác thiếu thốn.',
  'Six of Pentacles': 'Hào phóng, chia sẻ và cân bằng.',
  'Seven of Pentacles': 'Kiên nhẫn, đầu tư dài hạn.',
  'Eight of Pentacles': 'Cần cù, học hỏi và hoàn thiện.',
  'Nine of Pentacles': 'Độc lập tài chính, thành công cá nhân.',
  'Ten of Pentacles': 'Thịnh vượng gia đình, di sản lâu dài.',
  'Page of Pentacles': 'Học hỏi, cơ hội thực tế mới.',
  'Knight of Pentacles': 'Chăm chỉ, đáng tin và ổn định.',
  'Queen of Pentacles': 'Nuôi dưỡng, thực tế và giàu có.',
  'King of Pentacles': 'Thành công vật chất, kiểm soát tài chính.'
};

const tarotDeck = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers',
  'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',
  'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands', 'Six of Wands', 'Seven of Wands',
  'Eight of Wands', 'Nine of Wands', 'Ten of Wands', 'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands',
  'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups', 'Six of Cups', 'Seven of Cups',
  'Eight of Cups', 'Nine of Cups', 'Ten of Cups', 'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups',
  'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords', 'Six of Swords', 'Seven of Swords',
  'Eight of Swords', 'Nine of Swords', 'Ten of Swords', 'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords',
  'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles', 'Six of Pentacles',
  'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles', 'Page of Pentacles', 'Knight of Pentacles',
  'Queen of Pentacles', 'King of Pentacles'
];

// Hàm rút lá bài ngẫu nhiên
const getRandomCards = (count) => {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Invalid count: must be a positive integer');
  }
  const shuffled = [...tarotDeck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// Hàm lưu kết quả vào bảng tarot_last_draw
const saveLastDraw = async (db, userId, tarotResult) => {
  if (!userId || typeof userId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user_id: user_id must be a non-empty string',
    });
  }

  if (!tarotResult || typeof tarotResult !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid tarotResult: must be a non-empty object',
    });
  }

  let tarotResultJson;
  try {
    tarotResultJson = JSON.stringify(tarotResult);
  } catch (error) {
    console.error('Error serializing tarotResult:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: `Failed to serialize tarotResult: ${error.message}`,
    });
  }

  try {
    const timestamp = new Date().toISOString();
    await db.run(
      'INSERT OR REPLACE INTO tarot_last_draw (user_id, data, timestamp) VALUES (?, ?, ?)',
      [userId, tarotResultJson, timestamp]
    );
  } catch (error) {
    console.error('Error saving to tarot_last_draw:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to save tarot result: ${error.message}`,
    });
  }
};

// Hàm lưu kết quả vào bảng tarot_history (cho rút bài nâng cao)
const saveTarotHistory = async (db, userId, spreadType, date, tarotResult) => {
  if (!userId || typeof userId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user_id: user_id must be a non-empty string',
    });
  }

  if (!spreadType || typeof spreadType !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid spread_type: spread_type must be a non-empty string',
    });
  }

  if (!date || typeof date !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid date: date must be a non-empty string',
    });
  }

  if (!tarotResult || typeof tarotResult !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid tarotResult: must be a non-empty object',
    });
  }

  let tarotResultJson;
  try {
    tarotResultJson = JSON.stringify(tarotResult);
  } catch (error) {
    console.error('Error serializing tarotResult for history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: `Failed to serialize tarotResult: ${error.message}`,
    });
  }

  try {
    const timestamp = new Date().toISOString();
    await db.run(
      'INSERT INTO tarot_history (user_id, spread_type, date, data, timestamp) VALUES (?, ?, ?, ?, ?)',
      [userId, spreadType, date, tarotResultJson, timestamp]
    );
  } catch (error) {
    console.error('Error saving to tarot_history:', error.message);
    if (error.message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 400,
        statusMessage: `You have already drawn a ${spreadType} spread today`,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to save tarot history: ${error.message}`,
    });
  }
};

// Hàm kiểm tra giới hạn rút bài 1 lá
const checkSingleDrawLimit = async (db, userId, date) => {
  try {
    const row = await db.get(
      'SELECT count FROM tarot_limit WHERE user_id = ? AND date = ?',
      [userId, date]
    );
    return row ? row.count : 0;
  } catch (error) {
    console.error('Error checking single draw limit:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to check draw limit: ${error.message}`,
    });
  }
};

// Hàm tăng số lần rút bài 1 lá
const incrementSingleDrawLimit = async (db, userId, date) => {
  try {
    await db.run(
      'INSERT INTO tarot_limit (user_id, date, count) VALUES (?, ?, 1) ON CONFLICT(user_id, date) DO UPDATE SET count = count + 1',
      [userId, date]
    );
  } catch (error) {
    console.error('Error incrementing single draw limit:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to increment draw limit: ${error.message}`,
    });
  }
};

// Hàm gọi Gemini API để tạo diễn giải và lời khuyên
const fetchGeminiResponse = async (apiKey, prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API response error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('Invalid response format from Gemini API:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    return responseText;
  } catch (error) {
    console.error('Error in fetchGeminiResponse:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch from Gemini API: ${error.message}`,
    });
  }
};

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const body = await readBody(event);

  const { user_id, draw_type = 'spread', spread_type = 'past-present-future' } = body;

  // Kiểm tra user_id
  if (!user_id || typeof user_id !== 'string') {
    console.error('Invalid user_id:', user_id);
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid user_id: user_id must be a non-empty string',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY is not set in environment variables',
    });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const timestamp = new Date().toISOString();

    // Trường hợp rút 1 lá (draw_type = 'single')
    if (draw_type === 'single') {
  
      // Kiểm tra giới hạn rút bài 1 lá
      const drawCount = await checkSingleDrawLimit(db, user_id, today);
      if (drawCount >= 1) {
        throw createError({
          statusCode: 400,
          statusMessage: 'You have already drawn a single card today',
        });
      }

      const card = getRandomCards(1)[0];
      const defaultMeaning = defaultMeanings[card] || `${card} mang ý nghĩa đặc biệt cho ngày hôm nay.`;
    

      // Tạo prompt cho Gemini API
      const prompt = `
        Bạn là một nhà tiên tri Tarot chuyên nghiệp. Hãy tạo diễn giải và lời khuyên cho một lá bài Tarot rút hàng ngày.
        Lá bài là: ${card}.
        Ý nghĩa cơ bản của lá bài: ${defaultMeaning}.
        Trả về dưới dạng văn bản thuần túy (plain text), không dùng markdown, không thêm ký tự thừa, đúng định dạng sau:
        Diễn giải: Lá bài hôm nay của bạn là [Tên lá], đại diện cho [ý nghĩa]. Hôm nay, [diễn giải vận mệnh liên quan đến ý nghĩa lá bài, 50-70 từ].
        Lời khuyên: [Lời khuyên cụ thể, truyền cảm hứng, 20-30 từ].
      `;

      let interpretation = `Lá bài hôm nay của bạn là ${card}, đại diện cho ${defaultMeaning}. Hôm nay, bạn có thể cảm nhận được năng lượng này trong cuộc sống.`;
      let advice = 'Hãy tin vào trực giác và bước đi táo bạo.';

      try {
        const responseText = await fetchGeminiResponse(apiKey, prompt);
        const lines = responseText.split('\n').filter(line => line.trim());

        interpretation = lines[0]?.startsWith('Diễn giải: ')
          ? lines[0].replace('Diễn giải: ', '').trim()
          : interpretation;
        advice = lines[1]?.startsWith('Lời khuyên: ')
          ? lines[1].replace('Lời khuyên: ', '').trim()
          : advice;
      } catch (error) {
        console.error('Error fetching Gemini response for single card:', error.message);
        // Dùng giá trị mặc định nếu Gemini API thất bại
      }

      const tarotResult = {
        interpretation: interpretation,
        advice: advice
      };

      await saveLastDraw(db, user_id, tarotResult);
      await incrementSingleDrawLimit(db, user_id, today);

      return tarotResult;
    }

    // Trường hợp rút nhiều lá (draw_type = 'spread')
    let cardCount = 3;
    let positions = [];

    switch (spread_type) {
      case 'past-present-future':
        positions = ['Quá khứ', 'Hiện tại', 'Tương lai'];
        cardCount = 3;
        break;
      case 'love':
        positions = ['Bạn', 'Đối phương', 'Tương lai mối quan hệ'];
        cardCount = 3;
        break;
      case 'career':
        positions = ['Hiện tại', 'Thách thức', 'Cơ hội'];
        cardCount = 3;
        break;
      case 'celtic-cross':
        positions = ['Hiện tại', 'Thách thức', 'Quá khứ', 'Tương lai', 'Mục tiêu'];
        cardCount = 5;
        break;
      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid spread_type: ${spread_type}`,
        });
    }

    // Kiểm tra xem đã rút loại trải bài này hôm nay chưa
    const existingDraw = await db.get(
      'SELECT * FROM tarot_history WHERE user_id = ? AND spread_type = ? AND date = ?',
      [user_id, spread_type, today]
    );
    if (existingDraw) {
      throw createError({
        statusCode: 400,
        statusMessage: `You have already drawn a ${spread_type} spread today`,
      });
    }

    const selectedCards = getRandomCards(cardCount);
    const prompt = `
      Tạo trải bài Tarot ${cardCount} lá (${spread_type}) cho người dùng ${user_id} tại ${timestamp}.
      Sử dụng chính xác các lá bài sau: ${selectedCards.join(', ')}.
      Trả về dưới dạng văn bản thuần túy (plain text), không dùng markdown, không thêm ký tự thừa, đúng định dạng sau:
      ${positions.map(pos => `${pos}: [Tên lá] - [Ý nghĩa, 15-20 từ]`).join('\n')}
      Diễn giải tổng quát: [120-130 từ mô tả ý nghĩa tổng thể của trải bài]
      Lời khuyên: [20-30 từ gợi ý hành động]
      Đảm bảo ý nghĩa khớp với từng lá bài đã cho và đúng vị trí trong trải bài.
    `;

    const responseText = await fetchGeminiResponse(apiKey, prompt);
    const lines = responseText.split('\n').filter(line => line.trim());

    const cards = [];
    const usedCardNames = new Set();

    positions.forEach((pos, i) => {
      let line = lines[i]?.trim();
      let cardName, meaning;

      if (line && line.startsWith(`${pos}: `)) {
        const content = line.replace(`${pos}: `, '');
        const parts = content.split(' - ');
        cardName = parts[0]?.trim();
        meaning = parts[1]?.trim();
      }

      if (!cardName || !meaning || cardName !== selectedCards[i]) {
        cardName = selectedCards[i];
        meaning = defaultMeanings[cardName] || `${cardName} mang ý nghĩa đặc biệt cho ${pos}.`;
      }

      if (i > 0 && usedCardNames.has(cardName)) {
        const newCard = tarotDeck.find(card => !usedCardNames.has(card) && card !== selectedCards[i]);
        cardName = newCard || cardName;
        meaning = defaultMeanings[cardName] || `${cardName} mang ý nghĩa đặc biệt cho ${pos}.`;
      }

      usedCardNames.add(cardName);
      cards.push({ position: pos, text: `${cardName} - ${meaning}` });
    });

    const tarotResult = {
      cards,
      interpretation: lines[cardCount]?.startsWith('Diễn giải tổng quát: ')
        ? lines[cardCount].replace('Diễn giải tổng quát: ', '').trim()
        : 'Hành trình của bạn đang mở ra những cơ hội mới.',
      advice: lines[cardCount + 1]?.startsWith('Lời khuyên: ')
        ? lines[cardCount + 1].replace('Lời khuyên: ', '').trim()
        : 'Hãy tin vào trực giác và bước đi táo bạo.'
    };

    await saveTarotHistory(db, user_id, spread_type, today, tarotResult);
    await saveLastDraw(db, user_id, tarotResult);

    return tarotResult;
  } catch (error) {
    console.error('Error in tarot API:', error.message || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Server error: Unknown error',
    });
  }
});