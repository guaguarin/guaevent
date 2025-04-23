// pages/api/auth/callback.ts
import axios from 'axios';
import { bot, ready } from '../../../lib/discordClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const code = req.query.code;

  const data = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
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

    let nickname = null;

    // ✅ 如果 bot 準備好，就查暱稱（需要 DISCORD_GUILD_ID）
    if (ready && process.env.DISCORD_GUILD_ID) {
      try {
        const guild = await bot.guilds.fetch(process.env.DISCORD_GUILD_ID);
        const member = await guild.members.fetch(user.id);
        nickname = member.nickname || user.username;
      } catch (e) {
        console.warn('⚠️ 無法查詢 nickname，將略過寫入');
      }
    }

    // ✅ 更新或新增使用者至 Supabase
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        nickname,
      },
      create: {
        id: user.id,
        username: user.username,
        nickname,
      },
    });

    // ✅ 儲存 Cookie（加上 nickname）
    const userInfo = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      nickname,
    };

    res.setHeader(
      'Set-Cookie',
      `user=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; HttpOnly`
    );

    res.redirect('/events');
  } catch (err) {
    console.error('❌ Discord 登入錯誤：', err);
    res.status(500).send('登入失敗');
  }
}
