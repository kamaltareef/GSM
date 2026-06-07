'use client';

import { useState } from 'react';
import StatusBar from '../StatusBar';
import Icon from '../Icon';
import { SHIFTS_DATA, Shift } from '@/lib/data';

interface ShiftsScreenProps {
  onBack: () => void;
}

export default function ShiftsScreen({ onBack }: ShiftsScreenProps) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapSent, setSwapSent] = useState(false);
  const [swapTarget, setSwapTarget] = useState('');
  const [swapReason, setSwapReason] = useState('');
  const [swapShift, setSwapShift] = useState<Shift | null>(null);

  const weekDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  const shiftDays = [0, 1, 3, 5];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={16} color="#1A365D" /></button>
        <h1>המשמרות שלי</h1>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 16px 8px' }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>שבוע 27 אפר׳ – 3 מאי</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {weekDays.map((day, i) => {
              const dates = [27, 28, 29, 30, 1, 2, 3];
              const isNewMonth = i >= 4;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{day}</div>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: shiftDays.includes(i) ? '#1A365D' : (i === 0 ? '#ebf4ff' : 'transparent'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: i === 0 ? '2px solid #1A365D' : 'none',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: shiftDays.includes(i) ? 700 : 400, color: shiftDays.includes(i) ? '#fff' : isNewMonth ? '#94a3b8' : '#4a5568' }}>
                      {dates[i]}
                    </span>
                  </div>
                  {shiftDays.includes(i) && <div className="live-dot" style={{ width: 5, height: 5, background: '#38A169' }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D', marginBottom: 10 }}>פירוט משמרות</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {SHIFTS_DATA.map((s, i) => (
            <div key={i} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A365D' }}>{s.day}, {s.date}</div>
                  <div style={{ fontSize: 13, color: '#718096', marginTop: 3 }}>{s.start} – {s.end} • {s.station}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="badge badge-blue">{s.duration}</span>
                  <button onClick={() => { setSwapShift(s); setSwapOpen(true); }} style={{
                    display: 'block', marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: '#94a3b8', fontFamily: 'Heebo, sans-serif',
                  }}>החלפה</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => { setSwapShift(null); setSwapOpen(true); }}
          style={{ background: '#fff', color: '#1A365D', border: '1.5px solid #1A365D', height: 48, fontSize: 14, fontWeight: 600 }}>
          <Icon name="swap" size={18} color="#1A365D" /> בקשת החלפת משמרת
        </button>
      </div>

      {swapOpen && (
        <div className="confirm-overlay" onClick={() => { setSwapOpen(false); setSwapSent(false); }}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            {swapSent ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ width: 56, height: 56, background: '#f0faf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon name="check" size={28} color="#38A169" />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1A365D', marginBottom: 6 }}>הבקשה נשלחה</div>
                <span className="badge badge-orange" style={{ fontSize: 13 }}>ממתין לאישור מנהל</span>
                <div style={{ fontSize: 13, color: '#718096', marginTop: 10, marginBottom: 20 }}>הבקשה נשלחה למנהל לאישור. תקבל הודעה בהמשך.</div>
                <button className="btn-primary" onClick={() => { setSwapOpen(false); setSwapSent(false); }}>סגור</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1A365D', marginBottom: 16 }}>בקשת החלפת משמרת</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>איזו משמרת להחליף?</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {SHIFTS_DATA.map((s, i) => (
                        <button key={i} onClick={() => setSwapShift(s)} style={{
                          background: swapShift === s ? '#1A365D' : '#f7fafc',
                          border: `1.5px solid ${swapShift === s ? '#1A365D' : '#e2e8f0'}`,
                          borderRadius: 12, padding: '11px 14px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all 0.18s', fontFamily: 'Heebo, sans-serif',
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: swapShift === s ? '#fff' : '#1A365D' }}>{s.day}, {s.date}</span>
                          <span style={{ fontSize: 13, color: swapShift === s ? 'rgba(255,255,255,0.75)' : '#718096' }}>{s.start}–{s.end}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>עובד מקבל</div>
                    <input className="field" placeholder="שם העובד להחלפה" value={swapTarget} onChange={e => setSwapTarget(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>סיבת ההחלפה</div>
                    <textarea className="field" rows={3} placeholder="פרט את הסיבה..." value={swapReason} onChange={e => setSwapReason(e.target.value)} style={{ resize: 'none' }} />
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: 16, marginBottom: 10 }} onClick={() => setSwapSent(true)}>שלח בקשה</button>
                <button className="btn-outline" onClick={() => setSwapOpen(false)}>ביטול</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
