// pages/host/events/[id]/registrations.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventRegistrations() {
  const router = useRouter()
  const { id: eventId } = router.query

  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return

    const loadData = async () => {
      setLoading(true)

      const { data: eventData } = await supabase
        .from('Event')
        .select('*')
        .eq('id', eventId)
        .single()

      const { data: regData } = await supabase
        .from('Registration')
        .select('*, user:User(username, nickname, discordId)')
        .eq('eventId', eventId)
        .order('registeredAt', { ascending: true })

      setEvent(eventData)
      setRegistrations(regData || [])
      setLoading(false)
    }

    loadData()
  }, [eventId])

  if (loading) return <p className="p-6">載入中...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">📋 報名名單</h1>
      <p className="mb-4 text-gray-600">活動：{event?.title}</p>

      {registrations.length === 0 ? (
        <p>目前尚無人報名</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">暱稱 / 帳號</th>
              <th className="p-2">Discord ID</th>
              <th className="p-2">備註</th>
              <th className="p-2">報名時間</th>
              <th className="p-2">狀態</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{r.user?.nickname || r.user?.username}</td>
                <td className="p-2 text-gray-500">{r.user?.discordId}</td>
                <td className="p-2">{r.note || '-'}</td>
                <td className="p-2">{new Date(r.registeredAt).toLocaleString()}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
