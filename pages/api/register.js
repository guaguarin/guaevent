import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: '缺少活動 ID' });
  }

  // ⚠️ 模擬使用者（未來接 Discord OAuth 真實登入）
  const mockUser = {
    discordId: '123456789012345678',
    username: '測試用戶',
    avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/a_abc123.png',
  };

  try {
    // 1️⃣ 取得活動標題
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: '活動不存在' });
    }

    // 2️⃣ 找或建立使用者
    let user = await prisma.user.findUnique({
      where: { discordId: mockUser.discordId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          discordId: mockUser.discordId,
          username: mockUser.username,
          avatar: mockUser.avatar,
        },
      });
    }

    // 3️⃣ 寫入報名紀錄（可加入重複檢查）
    await prisma.registration.create({
      data: {
        userId: user.id,
        eventId,
      },
    });

    // 4️⃣ 寫入通知紀錄
    await prisma.notificationLog.create({
      data: {
        discordId: user.discordId,
        eventTitle: event.title,
      },
    });

    return res.status(200).json({ message: '✅ 報名成功' });
  } catch (err) {
    console.error('❌ 報名失敗：', err);
    return res.status(500).json({ error: '報名失敗' });
  }
}
