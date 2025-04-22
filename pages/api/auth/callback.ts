// pages/api/auth/callback.ts
import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;

  const data = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
  });

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`,
      },
    });

    const user = userRes.data;

    // 儲存 Cookie
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(JSON.stringify(user))}; Path=/;`)

    // 這裡你可以做：儲存 session、寫入資料庫等操作

    // ✅ 登入成功後導向活動頁
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    res.status(500).send('登入失敗');
  }
}
