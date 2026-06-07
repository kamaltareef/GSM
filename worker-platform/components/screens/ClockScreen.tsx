'use client';

import { useState, useEffect } from 'react';
import StatusBar from '../StatusBar';
import Icon from '../Icon';

interface ShiftEntry {
  date: string;
  in: string;
  out: string;
  dur: string;
}

interface ClockScreenProps {
  clockedIn: boolean;
  setClockedIn: (v: boolean) => void;
  onBack: () => void;
}

export default function ClockScreen({ clockedIn, setClockedIn, onBack }: ClockScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [history, setHistory] = useState<ShiftEntry[]>([
    { date: '01.05', in: '07:01:22', out: '15:00:48', dur: '7:59:26' },
    { date: '30.04', in: '07:00:05', out: '14:58:33', dur: '7:58:28' },
    { date: '28.04', in: '07:02:11', out: '15:01:07', dur: '7:58:56' },
    { date: '27.04', in: '15:00:30', out: '23:01:15', dur: '8:00:45' },
    { date: '25.04', in: '07:00:02', out: '15:00:50', dur: '8:00:48' },
  ]);
  const [timeStr, setTimeStr] = useState('');

  const getNowStr = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
  };

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}`;
  };

  useEffect(() => {
    setTimeStr(getNowStr());
    const t = setInterval(() => setTimeStr(getNowStr()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!clockedIn) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [clockedIn]);

  const SCHEDULED_START = { h: 7, m: 0 };
  const isEarlyClockIn = () => {
    const d = new Date();
    return d.getHours() < SCHEDULED_START.h || (d.getHours() === SCHEDULED_START.h && d.getMinutes() < SCHEDULED_START.m);
  };
  const earlyMinutes = () => {
    const d = new Date();
    const nowMins = d.getHours() * 60 + d.getMinutes();
    const schedMins = SCHEDULED_START.h * 60 + SCHEDULED_START.m;
    return Math.max(0, schedMins - nowMins);
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const getDateLabel = () => {
    const d = new Date();
    const days = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
    const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getConfirmDate = () => {
    const d = new Date();
    const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleConfirm = () => {
    if (clockedIn) {
      const outTime = getNowStr();
      const inTime = clockInTime || '07:00:00';
      const durH = Math.floor(elapsed / 3600).toString().padStart(2,'0');
      const durM = Math.floor((elapsed % 3600) / 60).toString().padStart(2,'0');
      const durS = (elapsed % 60).toString().padStart(2,'0');
      setHistory(h => [{ date: getTodayStr(), in: inTime, out: outTime, dur: `${durH}:${durM}:${durS}` }, ...h]);
      setElapsed(0);
      setClockInTime(null);
    } else {
      setClockInTime(getNowStr());
      setElapsed(0);
    }
    setClockedIn(!clockedIn);
    setConfirm(false);
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={16} color="#1A365D" /></button>
        <h1>שעון נוכחות</h1>
      </div>

      <div className="screen-scroll" style={{ padding: '20px 16px 16px' }}>
        <div style={{ background: clockedIn ? '#1A365D' : '#fff', borderRadius: 24, padding: '24px', textAlign: 'center', marginBottom: 16, boxShadow: '0 4px 24px rgba(26,54,93,0.15)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: clockedIn ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginBottom: 6 }}>שעה נוכחית</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: clockedIn ? '#fff' : '#1A365D', fontVariantNumeric: 'tabular-nums', letterSpacing: 1, marginBottom: 16 }}>
            {timeStr.slice(0,5)}<span style={{ fontSize: 22, opacity: 0.7 }}>{timeStr.slice(5)}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: clockedIn ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginBottom: 4 }}>{getDateLabel()}</div>
          {clockedIn && (
            <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>זמן משמרת</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#68d391', fontVariantNumeric: 'tabular-nums' }}>{fmt(elapsed)}</div>
            </div>
          )}
        </div>

        <button className="btn-primary" style={{ marginBottom: 16, background: clockedIn ? '#E53E3E' : '#38A169', height: 56, fontSize: 17 }}
          onClick={() => setConfirm(true)}>
          {clockedIn ? '⏹ יציאה ממשמרת' : '▶ כניסה למשמרת'}
        </button>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4a5568', marginBottom: 8 }}>הערות לסיום משמרת</div>
          <textarea className="field" rows={3} placeholder="רשום הערות אישיות למשמרת..." value={note} onChange={e => setNote(e.target.value)}
            style={{ resize: 'none', lineHeight: '1.6' }} />
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D', marginBottom: 10 }}>היסטוריית משמרות</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          {history.map((h, i) => (
            <div key={i} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A365D' }}>{h.date}</div>
                <span className="badge badge-green" style={{ fontSize: 11 }}>{h.dur}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <div style={{ fontSize: 12, color: '#718096' }}>כניסה: <span style={{ color: '#38A169', fontWeight: 600 }}>{h.in}</span></div>
                <div style={{ fontSize: 12, color: '#718096' }}>יציאה: <span style={{ color: '#E53E3E', fontWeight: 600 }}>{h.out}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(false)}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1A365D', marginBottom: 6 }}>
              {clockedIn ? 'אישור יציאה ממשמרת' : 'אישור כניסה למשמרת'}
            </div>
            <div style={{ fontSize: 14, color: '#718096', marginBottom: !clockedIn && isEarlyClockIn() ? 12 : 20 }}>
              השעה: {timeStr.slice(0,5)} — {getConfirmDate()}
            </div>
            {!clockedIn && isEarlyClockIn() && (
              <div style={{ background: '#fffaf0', border: '1.5px solid #f6ad55', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M12 2L2 20h20L12 2z" stroke="#dd6b20" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M12 9v5M12 16.5v.5" stroke="#dd6b20" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dd6b20' }}>כניסה לפני הזמן המיועד</div>
                  <div style={{ fontSize: 12, color: '#975a16', marginTop: 2 }}>המשמרת מתחילה ב-07:00 — אתה מקדים ב-{earlyMinutes()} דקות. הכניסה תירשם ותועבר לידיעת המנהל.</div>
                </div>
              </div>
            )}
            <button className="btn-primary" style={{ background: clockedIn ? '#E53E3E' : '#38A169', marginBottom: 10 }} onClick={handleConfirm}>
              {clockedIn ? 'אישור יציאה' : 'אישור כניסה'}
            </button>
            <button className="btn-outline" onClick={() => setConfirm(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
