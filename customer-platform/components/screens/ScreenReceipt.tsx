'use client';

import { useEffect, useRef } from 'react';
import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Button } from '../primitives';
import { IconCheck, IconGift, IconCoffee } from '../Icons';
import { recordTransaction } from '@/lib/db';

export default function ScreenReceipt({ theme, nav, state }: ScreenProps) {
  const amount = state.amount || 200;
  const recorded = useRef(false);

  // Log this sale to the shared Firestore `fuelTransactions` collection once,
  // so it shows up on the Manager dashboard (no-op if Firebase isn't configured).
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordTransaction({ plate: '52-847-91', station: 'GSM רוטשילד 04', type: 'fuel', amount, quantity: Math.round(amount / 7) }).catch(() => {});
  }, [amount]);

  const lines: [string, string][] = [
    ['תחנה', 'GSM | רוטשילד | 04'],
    ['משאבה', '07'],
    ['דלק', 'בנזין 95'],
    ['כמות', `${Math.round(amount / 7)} L`],
    ['מחיר לליטר', '₪7'],
    ['זמן התדלוק', '2:14 דקות'],
    ['אמצעי תשלום', 'ויזה •••• 4829'],
  ];
  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '20px auto 20px', background: theme.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 30px ${theme.ring}` }}>
          <IconCheck size={44} stroke="#fff" sw={3} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 6 }}>תדלוק הושלם</div>
        <div style={{ fontSize: 14, color: theme.ink2, marginBottom: 24 }}>החיוב בוצע | צפיה בקבלה למטה</div>

        <Card theme={theme} style={{ textAlign: 'right', padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '20px 22px', borderBottom: `1px dashed ${theme.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, letterSpacing: 1 }}>קבלה | #GSM-84291</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: MONO_FONT, marginTop: 4, letterSpacing: -0.8 }}>₪{amount}</div>
              </div>
              <Pill theme={theme} variant="accent">שולם</Pill>
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
          <div style={{ padding: '14px 22px', background: theme.gradSoft, borderTop: `1px dashed ${theme.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconGift size={18} stroke={theme.accent} />
            <div style={{ flex: 1, fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>+28 נקודות GSM</div>
              <div style={{ color: theme.ink2, fontSize: 11 }}>סה&quot;כ 1,247 נקודות</div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button theme={theme} variant="ghost" style={{ flex: 1 }} onClick={() => nav('store')} icon={<IconCoffee size={16} />}>הזמן קפה</Button>
          <Button theme={theme} style={{ flex: 1 }} onClick={() => nav('home')}>סיום</Button>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
