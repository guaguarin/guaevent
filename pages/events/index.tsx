import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventListPage() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    // 抓 cookie 裡的登入者
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (match) {
      try {
        const u = JSON.parse(decodeURIComponent(match[1]))
        setUser(u)
      } catch (e) {
        console.error('Cookie decode fail', e)
      }
    }

    // 從 Supabase 抓活動列表
    supabase
      .from('Event')
      .select('*')
      .order('startTime', { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data)
      })
  }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👋 歡迎來到呱呱釣蝦場 - 活動列表</h1>
      <p className="mb-4">你好，{user?.nickname || user?.username}</p>

      {events.map((event) => (
        <div key={event.id} className="border p-4 mb-3 rounded shadow">
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <p className="text-gray-600 text-sm mb-1">{event.description}</p>
          <Link href={`/events/${event.id}`}>
            <span className="text-blue-500 underline cursor-pointer text-sm">我要報名</span>
          </Link>
        </div>
      ))}
    </div>
  )
}
