// pages/events/[id]/register.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const { id: eventId } = router.query
  const [note, setNote] = useState('')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const cookieStr = document.cookie
    const match = cookieStr.match(/user=([^;]+)/)
    if (match) {
      const u = JSON.parse(decodeURIComponent(match[1]))
      setUser(u)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventId || !user) {
      setError('缺少使用者或活動資訊')
      return
    }

    const res = await fetch('/api/registrations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, userId: user.id, note }),
    })

    const result = await res.json()
    if (res.ok) {
      setSuccess(true)
    } else {
      setError(result.error || '報名失敗')
    }
  }

  if (!user) return <p className="p-6">請先登入</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">報名活動</h1>
      {success ? (
        <p className="text-green-600">✅ 報名成功！</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">備註</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border p-2"
              placeholder="想補充的話（選填）"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            送出報名
          </button>
        </form>
      )}
    </div>
  )
}
