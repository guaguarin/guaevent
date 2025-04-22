// pages/events/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const mockEvents = {
  '1': {
    title: 'Discord測試活動一',
    description: '測試用的！',
  },
  '2': {
    title: '測試活動二',
    description: '馬卡巴卡rin好棒棒🎨',
  }
}

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)

  const event = mockEvents[id]

  useEffect(() => {
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
  }, [])

  const handleRegister = async () => {
    if (!user) {
      alert('請先登入 Discord')
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        eventId: id,
        eventTitle: event?.title,
      }),
    })

    const result = await res.json()
    if (result.success) {
      alert('✅ 報名成功！Bot 稍後會通知你～')
    } else {
      alert('❌ 報名失敗：' + result.error)
    }
  }

  if (!event) return <p className="p-6">找不到這場活動 😢</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="mb-4 text-gray-600">{event.description}</p>
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        我要報名
      </button>
    </div>
  )
}
