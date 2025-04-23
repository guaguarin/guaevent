// pages/api/events/create-with-host.ts
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支援 POST 方法' })
  }

  const { title, description, startTime, endTime, userId } = req.body

  if (!title || !userId) {
    return res.status(400).json({ error: '缺少必要欄位（title, userId）' })
  }

  try {
    const id = uuidv4()

    // 建立活動
    await prisma.event.create({
      data: {
        id,
        title,
        description,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      },
    })

    // 加入主辦人
    await prisma.eventUserHost.create({
      data: {
        eventId: id,
        userId,
      },
    })

    return res.status(200).json({ success: true, eventId: id })
  } catch (err) {
    console.error('❌ 建立活動時發生錯誤：', err)
    return res.status(500).json({ error: '建立活動失敗：' + String(err) })
  }
}
