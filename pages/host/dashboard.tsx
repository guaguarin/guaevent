///pages/host/dashboard.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HostDashboard() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    // 從 Cookie 抓登入者
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (!match) return

    try {
      const u = JSON.parse(decodeURIComponent(match[1]))
      setUser(u)

      // 🚀 查詢這個主辦人的活動清單
      supabase
        .from('Event')
        .select('*')
        .contains('hosts', [u.id]) // 假設 Event.hosts 為 ID 陣列
        .order('startTime', { ascending: false })
        .then(({ data }) => {
          setEvents(data || [])
        })
    } catch (err) {
      console.error('Cookie 解析錯誤', err)
    }
  }, [])

  if (!user) return <p className="p-6">請先登入 Discord</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 主辦人後台</h1>
      <p className="mb-4">你好，{user.nickname || user.username}</p>

      <div className="flex justify-end mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          建立新活動（之後接功能）
        </button>
      </div>

      {events.length === 0 ? (
        <p>你還沒有主辦任何活動 😢</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="border p-4 mb-3 rounded shadow">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-gray-600 text-sm mb-1">
              ⏰ {event.startTime ? new Date(event.startTime).toLocaleString() : '未設定時間'}
            </p>
            <Link href={`/host/events/${event.id}`}>
              <span className="text-blue-500 underline cursor-pointer text-sm">查看報名名單</span>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}
