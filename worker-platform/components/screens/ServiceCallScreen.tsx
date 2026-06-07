'use client';

import { useState } from 'react';
import StatusBar from '../StatusBar';
import Icon from '../Icon';
import { SERVICE_CALLS, CALL_HISTORY } from '@/lib/data';

interface ServiceCallScreenProps {
  onBack: () => void;
}

export default function ServiceCallScreen({ onBack }: ServiceCallScreenProps) {
  const [ack, setAck] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [notes, setNotes] = useState('');
  const call = SERVICE_CALLS[0];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={16} color="#1A365D" /></button>
        <h1>קריאת שירות</h1>
        <span className="badge badge-red" style={{ fontSize: 11 }}>דחוף</span>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 16px 8px' }}>
        <div style={{ background: '#1A365D', borderRadius: 20, padding: '20px', marginBottom: 14, boxShadow: '0 4px 20px rgba(26,54,93,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>{call.id}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{call.type}</div>
            </div>
            <div style={{ background: '#E53E3E', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#fff' }}>דחוף</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', marginBottom: 14 }}>{call.desc}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(255,255,255,0.8)"/>
            </svg>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{call.location}</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="wrench" size={18} color="#1A365D" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D' }}>ציוד נדרש</div>
            <span className="badge badge-blue" style={{ marginRight: 'auto', fontSize: 11 }}>{call.tools.length} פריטים</span>
          </div>
          {call.tools.map((tool, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < call.tools.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
              <div style={{ width: 8, height: 8, background: '#1A365D', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: '#2d3748' }}>{tool}</span>
            </div>
          ))}
        </div>

        {!resolved ? (
          <>
            {!ack ? (
              <button className="btn-primary" style={{ marginBottom: 10, height: 52 }} onClick={() => setAck(true)}>
                ✓ אישור קבלת קריאה
              </button>
            ) : (
              <div style={{ background: '#f0faf4', border: '1.5px solid #38A169', borderRadius: 14, padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="check" size={18} color="#38A169" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#38A169' }}>הקריאה אושרה — בדרך לתיקון</span>
              </div>
            )}
            {ack && (
              <button className="btn-primary" style={{ background: '#E53E3E', height: 52 }} onClick={() => setResolveOpen(true)}>
                סגירת קריאה
              </button>
            )}
          </>
        ) : (
          <div style={{ background: '#f0faf4', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, background: '#38A169', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Icon name="check" size={24} color="#fff" />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#38A169' }}>הקריאה נסגרה בהצלחה</div>
          </div>
        )}

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D', margin: '16px 0 10px' }}>היסטוריית קריאות</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          {CALL_HISTORY.map((c, i) => (
            <div key={i} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A365D' }}>{c.type}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{c.id} • {c.date}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="badge badge-green" style={{ fontSize: 11 }}>טופל</span>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{c.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {resolveOpen && (
        <div className="confirm-overlay" onClick={() => setResolveOpen(false)}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1A365D', marginBottom: 14 }}>סיכום טיפול בתקלה</div>
            <textarea className="field" rows={4} placeholder="תאר את הפעולות שבוצעו לתיקון התקלה..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'none', marginBottom: 16 }} />
            <button className="btn-primary" style={{ background: '#38A169', marginBottom: 10 }} onClick={() => { setResolved(true); setResolveOpen(false); }}>אישור סגירה</button>
            <button className="btn-outline" onClick={() => setResolveOpen(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
