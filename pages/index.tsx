export default function Home() {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Discord 活動報名系統</h1>
        <a href="/api/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          使用 Discord 登入
        </a>
      </div>
    );
  }
  