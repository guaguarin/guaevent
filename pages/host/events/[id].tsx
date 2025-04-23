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

    // 活動名稱
    supabase
      .from('Event')
      .select('title')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setEventTitle(data?.title || '')
      })

    // 報名名單
    supabase
      .from('Registration')
      .select('*, user:User(nickname, username)')
      .eq('eventId', id)
      .order('registeredAt', { ascending: true })
      .then(({ data }) => {
        setRegistrations(data || [])
      })
  }, [id])

  // ✅ 更新狀態
  const handleUpdateStatus = async (regId: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/registration/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: regId, status }),
    })
    const result = await res.json()
    if (result.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status } : r))
      )
    } else {
      alert('❌ 更新失敗：' + result.error)
    }
  }

  // ✅ 即時更新備註欄位
  const handleNoteChange = (id: string, note: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, note } : r))
    )
  }

  // ✅ 儲存備註與狀態
  const saveChanges = async (regId: string) => {
    const reg = registrations.find((r) => r.id === regId)
    const res = await fetch('/api/registration-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: reg.id,
        status: reg.status,
        note: reg.note,
      }),
    })
    const result = await res.json()
    if (result.success) {
      alert('✅ 儲存成功')
    } else {
      alert('❌ 儲存失敗：' + result.error)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
              <th className="p-2">報名時間</th>
              <th className="p-2">狀態</th>
              <th className="p-2">備註</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{r.user?.nickname || r.user?.username}</td>
                <td className="p-2">{new Date(r.registeredAt).toLocaleString()}</td>
                <td className="p-2">
                  <select
                    value={r.status || ''}
                    onChange={(e) => handleUpdateStatus(r.id, e.target.value as any)}
                    className="border p-1 rounded"
                  >
                    <option value="">排隊中</option>
                    <option value="approved">通過</option>
                    <option value="rejected">不通過</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={r.note || ''}
                    onChange={(e) => handleNoteChange(r.id, e.target.value)}
                    className="border px-2 py-1 w-full rounded"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => saveChanges(r.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    儲存
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
