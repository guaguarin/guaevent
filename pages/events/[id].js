// pages/events/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!id) return

    // 撈活動資料
    supabase
      .from('Event')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('活動撈取失敗', error)
        } else {
          setEvent(data)
        }
      })
  }, [id])

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
