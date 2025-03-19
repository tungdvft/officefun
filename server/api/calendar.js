// server/api/calendar.js
import { defineEventHandler, getQuery, createError } from 'h3';
import { google } from 'googleapis';

const CLIENT_ID = '14260610616-tifcr2fa8031gmkiujk1l096rl8j67n4.apps.googleusercontent.com'; // Thay bằng Client ID từ Google
const CLIENT_SECRET = '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'; // Thay bằng Client Secret
const REDIRECT_URI = 'http://localhost:3000/api/calendar/callback'; // Redirect URI

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET' && query.action === 'auth') {
    // Trả về URL để xác thực Google
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
    return { authUrl };
  }

  if (method === 'GET' && query.action === 'callback' && query.code) {
    // Xử lý callback từ Google
    const { tokens } = await oauth2Client.getToken(query.code);
    oauth2Client.setCredentials(tokens);
    return { tokens }; // Trả về token để client lưu
  }

  if (method === 'POST' && query.action === 'sync') {
    // Đồng bộ với Google Calendar
    const body = await readBody(event);
    const tokens = body.tokens;
    if (!tokens) throw createError({ statusCode: 400, message: 'Missing tokens' });

    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const googleEvents = res.data.items || [];
    return googleEvents.map(ge => ({
      date: ge.start.dateTime.split('T')[0],
      time: ge.start.dateTime.split('T')[1].slice(0, 5),
      description: ge.summary,
      googleId: ge.id,
    }));
  }

  if (method === 'POST' && query.action === 'add') {
    // Thêm sự kiện lên Google Calendar
    const body = await readBody(event);
    const { tokens, event } = body;
    if (!tokens || !event) throw createError({ statusCode: 400, message: 'Missing tokens or event' });

    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const googleEvent = {
      summary: event.description,
      start: { dateTime: `${event.date}T${event.time}:00` },
      end: { dateTime: `${event.date}T${event.time}:00` }, // Có thể thêm duration nếu cần
    };

    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: googleEvent,
    });

    return { googleId: res.data.id };
  }

  if (method === 'POST' && query.action === 'delete') {
    // Xóa sự kiện khỏi Google Calendar
    const body = await readBody(event);
    const { tokens, googleId } = body;
    if (!tokens || !googleId) throw createError({ statusCode: 400, message: 'Missing tokens or googleId' });

    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleId,
    });

    return { success: true };
  }

  throw createError({ statusCode: 400, message: 'Invalid action' });
});