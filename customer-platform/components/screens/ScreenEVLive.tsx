'use client';

import { useState, useEffect } from 'react';
import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, StatTile, Pill, Button } from '../primitives';
import Hero from '../Hero';
import { IconCheck, IconCoffee } from '../Icons';

export default function ScreenEVLive({ theme, nav, heroVariant }: ScreenProps) {
  const [progress, setProgress] = useState(0.22);
  const done = progress >= 0.98;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setProgress(p => Math.min(0.98, p + 0.015)), 220);
    return () => clearTimeout(id);
  }, [progress, done]);

  const kwh = Math.round(progress * 62);
  const minsLeft = Math.max(0, Math.round((1 - progress) * 18));

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="טעינה פעילה" onBack={() => nav('home')} right={
        <Pill theme={theme} style={{ background: theme.ev + '18', color: theme.ev }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: done ? theme.success : theme.ev, animation: done ? 'none' : 'gsm-pulse 1.2s infinite' }} />
          עמדה 3
        </Pill>
      } />
      <div style={{ padding: '0 20px' }}>
        <Hero variant={heroVariant} theme={theme} progress={progress} evMode />

        <div style={{ display: 'flex', gap: 10, margin: '16px 0' }}>
          <StatTile theme={theme} label="טעון" value={`${Math.round(progress * 100)}%`} unit="SoC" accent={done ? theme.success : theme.ev} />
          <StatTile theme={theme} label="kWh" value={kwh} unit="/ 62" />
          <StatTile theme={theme} label={done ? 'הושלם' : 'נותר'} value={done ? '✓' : minsLeft} unit={done ? '' : 'דק׳'} accent={done ? theme.success : undefined} />
        </div>

        {done && (
          <Card theme={theme} style={{ marginBottom: 16, background: theme.success + '12', border: `1px solid ${theme.success}40`, display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconCheck size={22} stroke="#fff" sw={3} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: theme.success }}>הטעינה הושלמה!</div>
              <div style={{ fontSize: 12, color: theme.ink2 }}>נטענו {kwh} kWh | עמדה 3 | ₪{Math.round(kwh * 0.85)}</div>
            </div>
          </Card>
        )}

        {!done && (
          <Card theme={theme} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: theme.ink2, marginBottom: 6 }}>
              <span>הספק נוכחי</span><span style={{ fontFamily: MONO_FONT, color: theme.ev, fontWeight: 700 }}>347 kW</span>
            </div>
            <div style={{ height: 60, display: 'flex', gap: 3, alignItems: 'flex-end' }}>
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} style={{ flex: 1, background: theme.evGrad, borderRadius: 2, height: `${30 + Math.sin(i * 0.6) * 20 + 8}%`, opacity: 0.4 + (i / 32) * 0.6 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT }}>
              <span>−15 דק׳</span><span>עכשיו</span>
            </div>
          </Card>
        )}

        {!done && (
          <Card theme={theme} style={{ display: 'flex', gap: 14, alignItems: 'center', background: theme.gradSoft, border: `1px solid ${theme.accent}30`, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: theme.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCoffee size={24} stroke="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: theme.accent, fontFamily: MONO_FONT, fontWeight: 700, letterSpacing: 1 }}>הצעה לזמן ההמתנה</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>קפה + מאפה | 15₪ במקום 22₪</div>
            </div>
            <Button theme={theme} style={{ height: 40, padding: '0 14px', fontSize: 13 }} onClick={() => nav('store')}>הזמן</Button>
          </Card>
        )}

        {done && (
          <Button theme={theme} variant="ev" full onClick={() => nav('ev_receipt')} icon={<IconCheck size={18} stroke="#fff" sw={3} />}>
            לסיכום הטעינה
          </Button>
        )}
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
