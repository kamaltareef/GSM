'use client';

import { useState, useEffect } from 'react';

export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState('');
  const c = dark ? '#fff' : '#1A365D';

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', padding: '0 28px 8px',
      flexShrink: 0, background: dark ? '#1A365D' : '#fff', position: 'relative',
    }}>
      <div style={{ width: 130, height: 34, background: '#1a1a2e', borderRadius: '0 0 18px 18px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
      <span style={{ fontFamily: 'Heebo, sans-serif', fontWeight: 700, fontSize: 15, color: c, zIndex: 1 }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, zIndex: 1 }}>
        <svg width="16" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="23" height="12" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="18" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}
