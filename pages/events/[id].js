import { useRouter } from 'next/router';
import { events } from '../../data/events';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const event = events.find((e) => e.id === id);

  if (!event) return <p>找不到活動</p>;

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ eventId: event.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('✅ 報名成功！');
    } else {
      alert('❌ 報名失敗。');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>📅 日期：{event.date}</p>
      <button onClick={handleRegister} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        我要報名
      </button>
    </div>
  );
}
