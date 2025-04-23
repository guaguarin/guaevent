// pages/my/registrations.tsx

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MyRegistrations() {
  const [user, setUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])

  useEffect(() => {
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (!match) return

    try {
      const u = JSON.parse(decodeURIComponent(match[1]))
      setUser(u)

      supabase
        .from('Registration')
        .select('*, event:Event(title, description, startTime)')
        .eq('userId', u.id)
        .order('registeredAt', { ascending: false })
        .then(({ data }) => {
          setRegistrations(data || [])
        })
    } catch (e) {
      console.error('讀取 cookie 失敗', e)
    }
  }, [])

  if (!user) return <p className="p-6">請先登入 Discord</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎟️ 我的報名紀錄</h1>
      <p className="mb-4">你好，{user.nickname || user.username}</p>

      {registrations.length === 0 ? (
        <p>你還沒有報名任何活動</p>
      ) : (
        registrations.map((r) => (
          <div key={r.id} className="border p-4 mb-3 rounded shadow">
            <h2 className="text-lg font-semibold">{r.event?.title}</h2>
            <p className="text-gray-600 text-sm mb-1">
              報名時間：{new Date(r.registeredAt).toLocaleString()}
            </p>
            <p className="text-sm">
              狀態：
              {r.status === 'approved'
                ? '✅ 通過'
                : r.status === 'rejected'
                ? '❌ 拒絕'
                : '⏳ 排隊中'}
            </p>
            {r.note && (
              <p className="text-sm text-gray-500 mt-1">主辦人備註：{r.note}</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
