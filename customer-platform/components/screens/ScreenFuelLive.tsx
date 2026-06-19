'use client';

import { useState, useEffect } from 'react';
import { type ScreenProps, MONO_FONT, HE_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, StatTile } from '../primitives';
import Hero from '../Hero';
import { IconCheck } from '../Icons';

export default function ScreenFuelLive({ theme, nav, state, heroVariant }: ScreenProps) {
  const [progress, setProgress] = useState(0.08);

  useEffect(() => {
    if (progress >= 1) {
      const to = setTimeout(() => nav('fuel_done'), 900);
      return () => clearTimeout(to);
    }
    const id = setTimeout(() => setProgress(p => Math.min(1, p + 0.025)), 180);
    return () => clearTimeout(id);
  }, [progress, nav]);

  const amount = state.amount || 200;
  const currentAmount = Math.round(amount * progress);
  const currentLiters = Math.round(currentAmount / 7);

  const steps = [
    { label: 'זיהוי לוחית רישוי', done: true, t: '09:42:03', active: false },
    { label: 'נעילת משאבה 07 | דלק 95', done: true, t: '09:42:05', active: false },
    { label: 'זרוע רובוטית מזהה פתח', done: progress > 0.05, t: '09:42:08', active: false },
    { label: 'תדלוק פעיל', done: progress > 0.15, active: progress < 1, t: '09:42:14' },
    { label: 'חיוב מוצפן | סיום', done: progress >= 1, t: '—', active: false },
  ];

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="תדלוק פעיל" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px' }}>
        <Hero variant={heroVariant} theme={theme} progress={progress} />

        <div style={{ display: 'flex', gap: 10, margin: '16px 0' }}>
          <StatTile theme={theme} label="סכום" value={`₪${currentAmount}`} unit={`/ ₪${amount}`} accent={theme.accent} />
          <StatTile theme={theme} label="ליטרים" value={currentLiters} unit="L" />
          <StatTile theme={theme} label="קצב" value="38" unit="L/min" />
        </div>

        <Card theme={theme} style={{ padding: 0 }}>
          {steps.map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : 'none' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: s.done ? theme.success : s.active ? theme.accent : theme.ink + '10',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.done || s.active ? '#fff' : theme.ink3,
                animation: s.active ? 'gsm-pulse 1.4s infinite' : 'none',
              }}>
                {s.done ? <IconCheck size={12} stroke="#fff" sw={3} /> : s.active ? '●' : ''}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: s.active ? 700 : 500, color: s.done ? theme.ink : s.active ? theme.accent : theme.ink3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT }}>{s.t}</div>
            </div>
          ))}
        </Card>

        <button onClick={() => nav('fuel_done')} style={{
          width: '100%', marginTop: 14, padding: 14, background: 'transparent',
          border: `1.5px solid ${theme.ink}15`, borderRadius: 16,
          color: theme.ink2, fontSize: 14, fontWeight: 600, fontFamily: HE_FONT, cursor: 'pointer',
        }}>עצור תדלוק</button>
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
