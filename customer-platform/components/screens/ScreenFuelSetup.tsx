'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Button } from '../primitives';
import { IconCar, IconLock, IconChevronL, IconShield } from '../Icons';

export default function ScreenFuelSetup({ theme, nav, state, setState }: ScreenProps) {
  const [amount, setAmount] = useState(state.amount || 200);
  const pricePerLiter = 7;
  const liters = Math.round(amount / pricePerLiter);

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="הגדרת תדלוק" onBack={() => nav('arrival')} />
      <div style={{ padding: '0 20px' }}>
        <Card theme={theme} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCar size={22} stroke={theme.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>טויוטה קורולה | 52-847-91</div>
            <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT }}>משאבה 07 | בנזין 95</div>
          </div>
          <IconLock size={14} stroke={theme.success} />
        </Card>

        <Card theme={theme} style={{ marginBottom: 16, textAlign: 'center', padding: '28px 20px', background: theme.gradSoft, border: `1px solid ${theme.accent}30` }}>
          <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, letterSpacing: 1, marginBottom: 6 }}>סכום מקסימלי</div>
          <div style={{ fontSize: 68, fontWeight: 800, fontFamily: MONO_FONT, letterSpacing: -2, lineHeight: 1, color: theme.ink }}>₪{amount}</div>
          <div style={{ fontSize: 14, color: theme.ink2, marginTop: 8 }}>
            ≈ <span style={{ fontFamily: MONO_FONT, fontWeight: 700, color: theme.ink }}>{liters}</span> ליטר במחיר ₪{pricePerLiter} לליטר
          </div>
        </Card>

        <div style={{ padding: '10px 0 20px', direction: 'ltr' }}>
          <input type="range" min={50} max={800} step={10} value={amount}
            onChange={e => setAmount(+e.target.value)} dir="ltr"
            style={{
              width: '100%', height: 8, borderRadius: 100,
              background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent} ${(amount - 50) / 7.5}%, ${theme.ink}15 ${(amount - 50) / 7.5}%)`,
              appearance: 'none', WebkitAppearance: 'none', outline: 'none', display: 'block',
            }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT, direction: 'ltr' }}>
            <span>₪50</span><span>מלא | ₪800</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {([100, 200, 300, 'מלא'] as const).map(v => (
            <button key={v} onClick={() => setAmount(v === 'מלא' ? 800 : v)} style={{
              flex: 1, padding: '10px 0', borderRadius: 12,
              background: amount === (v === 'מלא' ? 800 : v) ? theme.ink : theme.surface,
              color: amount === (v === 'מלא' ? 800 : v) ? theme.surface : theme.ink,
              border: `1px solid ${theme.line}`, fontFamily: HE_FONT, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>{typeof v === 'number' ? `₪${v}` : v}</button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: theme.ink2, marginBottom: 8, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>תשלום</div>
          <button onClick={() => nav('wallet')} style={{ width: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: HE_FONT, direction: 'rtl' }}>
            <Card theme={theme} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 28, borderRadius: 5, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>VISA</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600, fontFamily: MONO_FONT, textAlign: 'right' }}>•••• 4829</div>
              <IconChevronL size={16} stroke={theme.ink3} />
            </Card>
          </button>
        </div>
      </div>

      <div style={{ padding: 20, position: 'sticky', bottom: 0, background: `linear-gradient(180deg, transparent, ${theme.bg} 40%)` }}>
        <Button theme={theme} full onClick={() => { setState({ ...state, amount }); nav('fuel_live'); }} icon={<IconShield size={16} stroke="#fff" />}>
          אשר והתחל תדלוק | ₪{amount}
        </Button>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT, display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
          <IconLock size={12} /> חיוב מוצפן מתבצע ברקע בסיום התדלוק
        </div>
      </div>
    </PhoneScreen>
  );
}
