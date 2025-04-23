// pages/host/events/create-with-host.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreateWithHost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (!match) return setError('無法取得使用者 Cookie')

    const user = JSON.parse(decodeURIComponent(match[1]))
    const res = await fetch('/api/events/create-with-host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        startTime,
        endTime,
        userId: user.id,
      }),
    })

    if (!res || res.status !== 200) {
      setError('建立失敗，請稍後再試')
      return
    }

    const result = await res.json()
    if (result.success) {
      router.push('/host/dashboard')
    } else {
      setError('建立失敗：' + result.error)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">建立活動（並成為主辦人）</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">標題</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2" required />
        </div>
        <div>
          <label className="block">說明</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2" />
        </div>
        <div>
          <label className="block">開始時間</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border p-2" />
        </div>
        <div>
          <label className="block">結束時間</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border p-2" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">建立</button>
      </form>
    </div>
  )
}
