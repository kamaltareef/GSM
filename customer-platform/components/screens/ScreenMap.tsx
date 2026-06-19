'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Button, TabBar } from '../primitives';
import { IconSearch, IconFuel, IconBolt, IconCoffee, IconNavigate } from '../Icons';

export default function ScreenMap({ theme, nav }: ScreenProps) {
  const [filter, setFilter] = useState('הכל');
  const [selected, setSelected] = useState(3);
  const stations = [
    { x: '30%', y: '28%', k: 'fuel', free: 3, label: 'יפו 02' },
    { x: '60%', y: '42%', k: 'fuel', free: 1, label: 'אבן גבירול 07' },
    { x: '75%', y: '22%', k: 'ev', free: 2, label: 'הרצליה 11' },
    { x: '25%', y: '60%', k: 'fuel', free: 5, label: 'רוטשילד 04' },
    { x: '55%', y: '70%', k: 'ev', free: 0, label: 'דיזנגוף 09' },
  ];
  const sel = stations[selected];

  return (
    <PhoneScreen theme={theme} fill>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${theme.surfaceAlt} 0%, ${theme.bg} 100%)` }}>
          <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="map-gridL" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke={theme.ink + '08'} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="800" fill="url(#map-gridL)" />
            <path d="M0 300 Q180 250, 400 320" stroke={theme.ink + '15'} strokeWidth="24" fill="none" />
            <path d="M100 0 L180 800" stroke={theme.ink + '10'} strokeWidth="16" fill="none" />
            <path d="M0 500 L400 550" stroke={theme.ink + '10'} strokeWidth="12" fill="none" />
          </svg>

          {stations.map((m, i) => {
            const active = i === selected;
            return (
              <button key={i} onClick={() => setSelected(i)} style={{
                position: 'absolute', left: m.x, top: m.y, transform: 'translate(-50%,-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                <div style={{
                  width: active ? 52 : 40, height: active ? 52 : 40, borderRadius: '50%',
                  background: m.k === 'ev' ? theme.evGrad : active ? theme.grad : theme.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `3px solid ${active ? '#fff' : theme.surface}`,
                  boxShadow: active ? `0 0 0 8px ${theme.ring}, 0 6px 20px ${theme.ring}` : `0 4px 12px ${theme.ink}20`,
                  color: m.k === 'ev' || active ? '#fff' : theme.accent,
                }}>
                  {m.k === 'ev' ? <IconBolt size={active ? 22 : 16} sw={2} /> : <IconFuel size={active ? 22 : 16} sw={2} />}
                </div>
                <div style={{ padding: '3px 8px', borderRadius: 100, background: theme.surface, boxShadow: `0 2px 8px ${theme.ink}22`, fontSize: 10, fontWeight: 700, color: theme.ink, fontFamily: HE_FONT, whiteSpace: 'nowrap' }}>GSM | {m.label}</div>
              </button>
            );
          })}
          <div style={{ position: 'absolute', left: '40%', top: '78%', width: 18, height: 18, borderRadius: '50%', background: '#0080FF', border: '3px solid #fff', boxShadow: '0 0 0 8px rgba(0,128,255,0.3)' }} />
        </div>

        <TopBar theme={theme} title="תחנות GSM" onBack={() => nav('home')}
          right={<Pill theme={theme} variant="accent" onClick={() => nav('history')}><IconSearch size={12} /> חיפוש</Pill>}
          style={{ position: 'relative', zIndex: 10 }} />

        <div style={{ padding: '0 20px', display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
          {['הכל', 'דלק', 'חשמל', 'חנות נוחות', 'שטיפה'].map((f, i) => (
            <Pill key={i} theme={theme} variant={filter === f ? 'accent' : 'outline'} onClick={() => setFilter(f)}>{f}</Pill>
          ))}
        </div>

        <div style={{ position: 'sticky', bottom: 0, marginTop: 'auto', padding: 20, zIndex: 10 }}>
          <Card theme={theme} style={{ background: theme.surface, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFuel size={22} stroke={theme.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>GSM | {sel.label}</div>
                <div style={{ fontSize: 12, color: theme.ink2, fontFamily: MONO_FONT }}>1.2 ק״מ | ₪7/L | {sel.free} משאבות פנויות</div>
              </div>
              <Pill theme={theme} style={{ background: theme.success + '18', color: theme.success }}>פתוח</Pill>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <Pill theme={theme}><IconFuel size={12} /> דלק</Pill>
              <Pill theme={theme}><IconBolt size={12} /> 2 × EV</Pill>
              <Pill theme={theme}><IconCoffee size={12} /> חנות</Pill>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button theme={theme} variant="ghost" style={{ flex: 1 }} onClick={() => nav('arrival')}>פרטים</Button>
              <Button theme={theme} style={{ flex: 1 }} icon={<IconNavigate size={16} stroke="#fff" />} onClick={() => nav('arrival')}>נווט לתחנה</Button>
            </div>
          </Card>
        </div>
        <TabBar theme={theme} active="map" onNav={nav} />
      </div>
    </PhoneScreen>
  );
}
