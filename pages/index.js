import Link from 'next/link';
import { events } from '../data/events';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋 活動列表</h1>
      {events.map((event) => (
        <div key={event.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>📅 日期：{event.date}</p>
          <Link href={`/events/${event.id}`}>
            <button style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>查看詳情</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
