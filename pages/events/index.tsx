// pages/events/index.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 取得登入使用者 & 暱稱
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (match) {
      try {
        const u = JSON.parse(decodeURIComponent(match[1]))
        setUser(u)

        // 🚀 呼叫 API 拿伺服器暱稱
        fetch(`/api/nickname?id=${u.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.nickname) {
              setUser((prev) => ({ ...prev, nickname: data.nickname }))
            }
          })
      } catch (e) {
        console.error('Cookie decode fail', e)
      }
    }

    // 撈活動清單
    const fetchEvents = async () => {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    }

    fetchEvents()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">歡迎來到呱呱釣蝦場－活動列表 👋</h1>
      <p className="mb-6">你好，{user?.nickname || user?.username || '訪客'}</p>

      {events.length === 0 ? (
        <p>尚無活動</p>
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
