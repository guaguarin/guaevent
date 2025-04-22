// pages/api/register.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, eventId, eventTitle } = req.body
  console.log('👉 接收到報名請求', { userId, eventId, eventTitle })

  try {
    // 先查是否已報名過
    const { data: existing, error: fetchError } = await supabase
      .from('Registration')
      .select('*')
      .eq('userId', userId)
      .eq('eventId', eventId)

    if (fetchError) throw fetchError

    if (existing && existing.length > 0) {
      console.log('⚠️ 已報名過，不重複寫入')
      return res.status(200).json({
        success: false,
        error: '你已經報名過這個活動囉 😄',
      })
    }

    console.log('✅ 寫入報名資料...')
    await supabase.from('Registration').insert([
      {
        userId,
        eventId,
        status: 'pending', // ✅ 新增這行
      },
    ])

    console.log('✅ 寫入通知資料...')
    const { error: notifyErr } = await supabase.from('NotificationLog').insert([
      {
        discordId: userId,
        eventTitle,
      },
    ])

    if (notifyErr) {
      console.error('❌ 通知寫入失敗：', notifyErr)
      return res.status(500).json({ success: false, error: notifyErr.message })
    }

    console.log('✅ 報名與通知完成')
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('❌ 報名錯誤：', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
