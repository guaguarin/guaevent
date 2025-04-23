// pages/api/registrations/create.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: '只接受 POST 方法' })

    const { eventId, userId, note } = req.body

    console.log('📦 收到報名資料：', { eventId, userId, note })

    if (!eventId || !userId) {
      return res.status(400).json({ error: '缺少必要欄位 eventId 或 userId' })
    }

    const { error } = await supabase.from('Registration').insert({
      eventId,
      userId,
      note,
      status: 'submitted',
      registeredAt: new Date().toISOString(),
    })

    if (error) {
      console.error('❌ Supabase 插入失敗：', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('❌ 發生未預期錯誤：', err)
    return res.status(500).json({ error: '伺服器內部錯誤', detail: err.message || err })
  }
}
