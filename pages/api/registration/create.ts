// pages/api/registrations/create.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: '只接受 POST 方法' })

  const { eventId, userId, note } = req.body

  if (!eventId || !userId) {
    return res.status(400).json({ error: '缺少必要欄位 eventId 或 userId' })
  }

  const { error } = await supabase.from('Registration').insert({
    eventId,
    userId,
    note,
    status: 'submitted', // 預設狀態
    registeredAt: new Date().toISOString(), // 手動填入時間
  })

  if (error) {
    console.error('❌ 報名失敗：', error)
    return res.status(500).json({ error: '報名失敗' })
  }

  res.status(200).json({ success: true })
}
