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
  const [reasonMap, setReasonMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return
    loadData()
  }, [eventId])

  const loadData = async () => {
    setLoading(true)

    const { data: eventData } = await supabase
      .from('Event')
      .select('*')
      .eq('id', eventId)
      .single()

    const { data: regData } = await supabase
      .from('Registration')
      .select('*, user:User(username, nickname)')
      .eq('eventId', eventId)
      .order('registeredAt', { ascending: true })

    setEvent(eventData)
    setRegistrations(regData || [])
    setLoading(false)
  }

  const updateStatus = async (registrationId: string, newStatus: string) => {
    const reason = reasonMap[registrationId] || ''
    const { error } = await supabase
      .from('Registration')
      .update({ status: newStatus, note: reason })
      .eq('id', registrationId)

    if (!error) {
      loadData()
    } else {
      alert('更新狀態失敗')
    }
  }

  if (loading) return <p className="p-6">載入中...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">📋 報名名單</h1>
      <p className="mb-1 text-gray-600">活動：{event?.title}</p>
      <p className="mb-4 text-sm text-gray-500">報名總人數：{registrations.length} 位</p>

      {registrations.length === 0 ? (
        <p>目前尚無人報名</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">暱稱 / 帳號</th>
              <th className="p-2">備註</th>
              <th className="p-2">報名時間</th>
              <th className="p-2">狀態</th>
              <th className="p-2">審核理由</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{r.user?.nickname || r.user?.username}</td>
                <td className="p-2 whitespace-pre-wrap">{r.note || '-'}</td>
                <td className="p-2">{new Date(r.registeredAt).toLocaleString('zh-TW')}</td>
                <td className="p-2">
                  {r.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => updateStatus(r.id, 'approved')}
                      >
                        通過
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => updateStatus(r.id, 'rejected')}
                      >
                        拒絕
                      </button>
                    </div>
                  )}
                  {r.status === 'approved' && (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">已通過</span>
                  )}
                  {r.status === 'rejected' && (
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">未通過</span>
                  )}
                </td>
                <td className="p-2 w-48">
                  {r.status === 'submitted' ? (
                    <textarea
                      className="w-full p-1 border rounded text-xs"
                      placeholder="可填寫備註或理由"
                      value={reasonMap[r.id] || ''}
                      onChange={(e) =>
                        setReasonMap((prev) => ({ ...prev, [r.id]: e.target.value }))
                      }
                    />
                  ) : (
                    <span className="text-xs text-gray-700 whitespace-pre-wrap">{r.note || '-'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
