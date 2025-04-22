// pages/events/index.tsx
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    // 假設你之前把使用者資訊存進 localStorage
    const user = JSON.parse(localStorage.getItem('discordUser') || '{}')
    setUsername(user.username || '訪客')
  }, [])

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">歡迎來到活動頁 👋</h1>
      <p>你好，<strong>{username}</strong></p>
      <p className="mt-4">這裡未來會顯示活動列表與報名按鈕！</p>
    </div>
  )
}
