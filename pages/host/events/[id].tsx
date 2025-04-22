// pages/host/events/[id].tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventRegistrations() {
  const router = useRouter()
  const { id } = router.query

  const [eventTitle, setEventTitle] = useState('')
  const [registrations, setRegistrations] = useState<any[]>([])

  useEffect(() => {
    if (!id) return

    // 取得活動名稱
    supabase
      .from('Event')
      .select('title')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setEventTitle(data?.title || '')
      })

    // 撈取報名資料 + 使用者資料
    supabase
      .from('Registration')
      .select('*, user:User(nickname, username, discordId)')
      .eq('eventId', id)
      .order('registeredAt', { ascending: true })
      .then(({ data }) => {
        setRegistrations(data || [])
      })
  }, [id])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 活動報名名單</h1>
      <p className="mb-4 text-gray-600">活動名稱：{eventTitle}</p>

      {registrations.length === 0 ? (
        <p>目前尚無人報名</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">暱稱 / 帳號</th>
              <th className="p-2">Discord ID</th>
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
                <td className="p-2">{new Date(r.registeredAt).toLocaleString()}</td>
                <td className="p-2">{r.status || '排隊中'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
