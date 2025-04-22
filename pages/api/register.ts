// pages/api/register.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, eventId, eventTitle } = req.body

  try {
    // 先查是否已報名過
    const { data: existing, error: fetchError } = await supabase
      .from('Registration')
      .select('*')
      .eq('userId', userId)
      .eq('eventId', eventId)

    if (fetchError) throw fetchError

    if (existing && existing.length > 0) {
      return res.status(200).json({
        success: false,
        error: '你已經報名過這個活動囉 😄',
      })
    }

    // 寫入報名資料
    await supabase.from('Registration').insert([
      { userId, eventId },
    ])

    // 寫入通知排程
    await supabase.from('NotificationLog').insert([
      {
        discordId: userId,
        eventTitle,
      },
    ])

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('報名錯誤：', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
