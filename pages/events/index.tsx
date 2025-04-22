import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventsPage() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Discord測試活動一', description: '測試用的！' },
    { id: '2', title: '測試活動二', description: '馬卡巴卡rin好棒棒🎨' }
  ])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 讀 Cookie 取得登入資訊
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (match) {
      try {
        const u = JSON.parse(decodeURIComponent(match[1]))
        setUser(u)

        // 🔍 從 Supabase 抓 nickname
        supabase
          .from('User')
          .select('nickname')
          .eq('discordId', u.id)
          .single()
          .then(({ data }) => {
            if (data?.nickname) {
              setUser((prev: any) => ({ ...prev, nickname: data.nickname }))
            }
          })
      } catch (e) {
        console.error('Cookie decode fail', e)
      }
    }
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">歡迎來到呱呱釣蝦場－活動列表 👋</h1>
      <p className="mb-6">你好，{user?.nickname || user?.username || '訪客'}</p>

      {events.length === 0 ? (
        <p>目前沒有活動</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <Link href={`/events/${event.id}`}>
              <span className="text-blue-600 underline cursor-pointer">我要報名</span>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}
