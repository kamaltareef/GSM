'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Section, TabBar } from '../primitives';
import { IconCar, IconBolt, IconBell, IconShield, IconSettings, IconUser, IconChevronL } from '../Icons';

export default function ScreenProfile({ theme, nav }: ScreenProps) {
  const [notifsOn, setNotifsOn] = useState(true);

  const vehicles = [
    { name: 'טויוטה קורולה', plate: '52-847-91', fuel: 'בנזין 95', primary: true, ev: false, icon: IconCar },
    { name: 'טסלה מודל 3', plate: '77-394-01', fuel: 'חשמלי | 62 kWh', primary: false, ev: true, icon: IconBolt },
  ];

  const settings = [
    { I: IconBell, l: 'התראות', r: notifsOn ? 'פעילות' : 'כבוי', onClick: () => setNotifsOn(v => !v) },
    { I: IconShield, l: 'פרטיות ואבטחה', r: null as string | null, onClick: () => nav('wallet') },
    { I: IconSettings, l: 'העדפות אפליקציה', r: null as string | null, onClick: () => nav('notifications') },
    { I: IconUser, l: 'פרטים אישיים', r: null as string | null, onClick: () => nav('onboard') },
  ];

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="פרופיל" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 4px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: theme.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800, fontFamily: MONO_FONT }}>ש</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>שרה כהן</div>
            <div style={{ fontSize: 12, color: theme.ink2, fontFamily: MONO_FONT }}>חברה מאז 2024 | 1,247 נקודות</div>
          </div>
        </div>

        <Section theme={theme} title="הרכבים שלי"
          right={<button onClick={() => nav('onboard')} style={{ background: 'none', border: 'none', color: theme.accent, fontWeight: 600, fontSize: 13, fontFamily: HE_FONT, cursor: 'pointer' }}>+ הוסף</button>}>
          {vehicles.map((v, i) => {
            const I = v.icon;
            return (
              <Card key={i} theme={theme} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: v.ev ? theme.ev + '15' : theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I size={22} stroke={v.ev ? theme.ev : theme.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT }}>{v.plate} | {v.fuel}</div>
                </div>
                {v.primary && <Pill theme={theme} variant="accent">ראשי</Pill>}
              </Card>
            );
          })}
        </Section>

        <Section theme={theme} title="הגדרות">
          <Card theme={theme} style={{ padding: 0 }}>
            {settings.map(({ I, l, r, onClick }, i, arr) => (
              <button key={i} onClick={onClick} style={{
                width: '100%', display: 'flex', gap: 14, alignItems: 'center', padding: '14px 18px',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : 'none',
                background: 'transparent', cursor: 'pointer', direction: 'rtl', fontFamily: HE_FONT,
              }}>
                <I size={18} stroke={theme.ink2} />
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, textAlign: 'right', color: theme.ink }}>{l}</div>
                {r && <span style={{ fontSize: 12, color: theme.ink3 }}>{r}</span>}
                <IconChevronL size={16} stroke={theme.ink3} />
              </button>
            ))}
          </Card>
        </Section>

        <div style={{ height: 100 }} />
        <TabBar theme={theme} active="profile" onNav={nav} />
      </div>
    </PhoneScreen>
  );
}
