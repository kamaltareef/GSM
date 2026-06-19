'use client';

import { useEffect, useRef } from 'react';
import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Button } from '../primitives';
import { IconBolt, IconGift, IconHome } from '../Icons';
import { recordTransaction } from '@/lib/db';

export default function ScreenEVReceipt({ theme, nav }: ScreenProps) {
  const kwh = 60;
  const cost = Math.round(kwh * 0.85);
  const recorded = useRef(false);

  // Log this EV charge to the shared Firestore `fuelTransactions` collection once.
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordTransaction({ plate: '77-394-01', station: 'GSM רוטשילד 04', type: 'ev', amount: cost, quantity: kwh }).catch(() => {});
  }, [cost]);

  const lines: [string, string][] = [
    ['עמדה', 'עמדה 3 | DC מהיר'],
    ['אנרגיה', `${kwh} kWh`],
    ['מחיר', '85 אגורות/kWh'],
    ['משך', '18 דקות'],
    ['אמצעי תשלום', 'ויזה •••• 4829'],
    ['תאריך', '23.04.2026 | 09:44'],
  ];
  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '16px auto 20px', background: theme.evGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 30px ${theme.ev}55` }}>
          <IconBolt size={44} stroke="#fff" sw={2.5} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 6 }}>הטעינה הושלמה</div>
        <div style={{ fontSize: 14, color: theme.ink2, marginBottom: 24 }}>עמדה 3 | DC מהיר | GSM רוטשילד</div>

        <Card theme={theme} style={{ textAlign: 'right', padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '20px 22px', borderBottom: `1px dashed ${theme.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, letterSpacing: 1 }}>קבלה | #GSM-EV-29841</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: MONO_FONT, marginTop: 4, letterSpacing: -0.8 }}>₪{cost}</div>
              </div>
              <Pill theme={theme} variant="ev">שולם</Pill>
            </div>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {lines.map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 13 }}>
                <span style={{ color: theme.ink2 }}>{k}</span>
                <span style={{ fontWeight: 600, fontFamily: MONO_FONT }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 22px', background: theme.ev + '10', borderTop: `1px dashed ${theme.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconGift size={18} stroke={theme.ev} />
            <div style={{ flex: 1, fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>+18 נקודות GSM</div>
              <div style={{ color: theme.ink2, fontSize: 11 }}>סה&quot;כ 1,265 נקודות</div>
            </div>
          </div>
        </Card>

        <Button theme={theme} variant="ev" full onClick={() => nav('home')} icon={<IconHome size={16} stroke="#fff" />}>
          חזרה לדף הבית
        </Button>
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
