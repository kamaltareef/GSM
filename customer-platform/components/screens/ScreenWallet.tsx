'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Button, Section, TabBar } from '../primitives';
import { IconPlus, IconShield, IconLock } from '../Icons';

export default function ScreenWallet({ theme, nav }: ScreenProps) {
  const [balance, setBalance] = useState(248);
  const [topup, setTopup] = useState(100);
  const [defaultCard, setDefaultCard] = useState(0);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNum, setNewCardNum] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');

  const cardInput: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 15,
    fontFamily: MONO_FONT, direction: 'ltr', textAlign: 'center',
    border: `1px solid ${theme.line}`, background: theme.surfaceAlt, color: theme.ink,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="ארנק ומנוי" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px' }}>
        <Card theme={theme} padded={false} style={{ overflow: 'hidden', border: 'none', background: theme.grad, color: '#fff', marginBottom: 16 }}>
          <div style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.8, fontFamily: MONO_FONT, letterSpacing: 1 }}>יתרה | GSM+</div>
                <div style={{ fontSize: 44, fontWeight: 800, fontFamily: MONO_FONT, marginTop: 6, letterSpacing: -1.5 }}>₪{balance}</div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.22)', fontSize: 10, fontWeight: 700, fontFamily: MONO_FONT, letterSpacing: 1 }}>GSM+</div>
            </div>
            <div style={{ marginTop: 18, fontSize: 12, opacity: 0.9 }}>מנוי פעיל | חוסך 87 אגורות לליטר | מחדש 01.05</div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[50, 100, 200, 500].map(v => (
            <button key={v} onClick={() => setTopup(v)} style={{
              flex: 1, padding: 14, borderRadius: 14,
              border: topup === v ? `2px solid ${theme.accent}` : `1px solid ${theme.line}`,
              background: topup === v ? theme.gradSoft : theme.surface, color: theme.ink,
              fontFamily: MONO_FONT, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>₪{v}</button>
          ))}
        </div>
        <Button theme={theme} full onClick={() => setBalance(b => b + topup)} icon={<IconPlus size={16} stroke="#fff" />}>טען ₪{topup}</Button>

        <Section theme={theme} title="חיסכון חודשי">
          <Card theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.ink2 }}>נחסך באפריל</div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: MONO_FONT, color: theme.success }}>₪162</div>
              </div>
              <IconShield size={36} stroke={theme.success} />
            </div>
            <div style={{ height: 4, borderRadius: 100, background: theme.ink + '10', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: theme.success }} />
            </div>
            <div style={{ fontSize: 11, color: theme.ink2, marginTop: 8 }}>72% מהיעד החודשי | ₪225</div>
          </Card>
        </Section>

        <Section theme={theme} title="אמצעי תשלום"
          right={<button onClick={() => setShowAddCard(v => !v)} style={{ background: 'none', border: 'none', color: theme.accent, fontWeight: 600, fontSize: 13, fontFamily: HE_FONT, cursor: 'pointer' }}>+ הוסף</button>}>
          {showAddCard && (
            <Card theme={theme} style={{ marginBottom: 10, border: `1.5px solid ${theme.accent}40`, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>הוסף כרטיס אשראי</div>
                <button onClick={() => setShowAddCard(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: theme.ink3, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, marginBottom: 5 }}>מספר כרטיס</div>
                <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength={19} value={newCardNum}
                  onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 16); setNewCardNum(raw.replace(/(.{4})/g, '$1 ').trim()); }}
                  style={{ ...cardInput, letterSpacing: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, marginBottom: 5 }}>תוקף</div>
                  <input type="text" placeholder="MM/YY" maxLength={5} value={newExpiry} onChange={e => setNewExpiry(e.target.value)} style={cardInput} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT, marginBottom: 5 }}>CVV</div>
                  <input type="text" inputMode="numeric" placeholder="000" maxLength={3} value={newCvv} onChange={e => setNewCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} style={cardInput} />
                </div>
              </div>
              <Button theme={theme} full style={{ height: 46 }}
                onClick={() => { setShowAddCard(false); setNewCardNum(''); setNewExpiry(''); setNewCvv(''); }}
                icon={<IconLock size={14} stroke="#fff" />}>
                הוסף כרטיס מאובטח
              </Button>
            </Card>
          )}
          <Card theme={theme} style={{ padding: 0 }}>
            {([['VISA', '•••• 4829'], ['MC', '•••• 1902']] as [string, string][]).map(([b, n], i, arr) => (
              <button key={i} onClick={() => setDefaultCard(i)} style={{
                width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px',
                borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : 'none',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                background: defaultCard === i ? theme.surfaceAlt : 'transparent', cursor: 'pointer', direction: 'rtl', fontFamily: HE_FONT,
              }}>
                <div style={{ width: 40, height: 28, borderRadius: 5, background: theme.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>{b}</div>
                <div style={{ flex: 1, fontFamily: MONO_FONT, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{n}</div>
                {defaultCard === i && <Pill theme={theme}>ברירת מחדל</Pill>}
              </button>
            ))}
          </Card>
        </Section>

        <div style={{ height: 100 }} />
        <TabBar theme={theme} active="wallet" onNav={nav} />
      </div>
    </PhoneScreen>
  );
}
