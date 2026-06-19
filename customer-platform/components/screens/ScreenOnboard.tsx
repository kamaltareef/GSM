'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Button, Card, Pill } from '../primitives';
import { IconCheck, IconShield, IconSearch, IconDroplet, IconLock, IconPlus } from '../Icons';

export default function ScreenOnboard({ theme, nav }: ScreenProps) {
  const [step, setStep] = useState(0);
  const [plateInput, setPlateInput] = useState('');
  const [plateFound, setPlateFound] = useState(false);
  const [plateSearching, setPlateSearching] = useState(false);
  const steps = [
    { label: 'רכב', title: 'הוסף את הרכב שלך', sub: 'הזן את מספר הלוחית — נמשוך את הפרטים ממשרד הרישוי' },
    { label: 'דלק', title: 'דלק זוהה', sub: 'לא צריך לבחור — המערכת יודעת' },
    { label: 'תשלום', title: 'אמצעי תשלום', sub: 'מוצפן, נטען ברקע בזמן התדלוק' },
  ];
  const cur = steps[step];

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="הגדרה ראשונית" onBack={step > 0 ? () => setStep(step - 1) : () => nav('register')} />
      <div style={{ display: 'flex', gap: 6, padding: '0 20px 20px' }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= step ? theme.accent : theme.ink + '15', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 11, fontFamily: MONO_FONT, color: theme.accent, letterSpacing: 1, marginBottom: 10 }}>
          שלב {step + 1} / {steps.length}
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 6 }}>{cur.title}</div>
        <div style={{ fontSize: 14, color: theme.ink2, marginBottom: 28 }}>{cur.sub}</div>

        {step === 0 && (
          <div>
            <Card theme={theme} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: theme.ink2, marginBottom: 10, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>מספר לוחית רישוי</div>
              <input
                type="text" value={plateInput}
                onChange={e => { setPlateInput(e.target.value.slice(0, 10)); setPlateFound(false); }}
                placeholder="52-847-91" maxLength={10}
                style={{
                  width: '100%', padding: '14px 12px', background: '#FFD93A', color: '#111',
                  borderRadius: 14, fontFamily: MONO_FONT, fontSize: 32, fontWeight: 800, letterSpacing: 4,
                  border: '3px solid #111', textAlign: 'center', outline: 'none', boxSizing: 'border-box', direction: 'ltr',
                }}
              />
              <button
                onClick={() => {
                  if (!plateInput.trim() || plateSearching) return;
                  setPlateSearching(true);
                  setTimeout(() => { setPlateSearching(false); setPlateFound(true); }, 1400);
                }}
                disabled={!plateInput.trim() || plateSearching}
                style={{
                  marginTop: 12, width: '100%', padding: '13px 16px', borderRadius: 14, border: 'none',
                  cursor: plateInput.trim() && !plateSearching ? 'pointer' : 'not-allowed',
                  background: plateInput.trim() ? theme.grad : theme.ink + '15',
                  color: plateInput.trim() ? '#fff' : theme.ink3,
                  fontFamily: HE_FONT, fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: !plateInput.trim() ? 0.5 : 1,
                }}
              >
                {plateSearching
                  ? <><span style={{ animation: 'gsm-pulse 1s infinite', display: 'inline-block' }}>●</span> מחפש ברשומות משרד הרישוי...</>
                  : <><IconSearch size={16} /> בדוק רכב</>}
              </button>
            </Card>

            {plateFound && (
              <div className="gsm-fade">
                <Card theme={theme} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>טויוטה קורולה | 2022</div>
                      <div style={{ fontSize: 12, color: theme.ink2, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>זוהה ממאגר משרד הרישוי</div>
                    </div>
                    <IconCheck size={22} stroke={theme.success} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Pill theme={theme}><IconDroplet size={13} /> בנזין 95</Pill>
                    <Pill theme={theme}>1.8L</Pill>
                    <Pill theme={theme}>היברידי</Pill>
                  </div>
                </Card>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 4px 0', fontSize: 12, color: theme.ink2 }}>
                  <IconShield size={14} stroke={theme.success} />
                  <span>הרכב אומת. סוג הדלק ננעל אוטומטית — בנזין 95.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <Card theme={theme} style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: 100, height: 100, margin: '0 auto 16px', borderRadius: '50%', background: theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${theme.accent}` }}>
                <IconDroplet size={44} stroke={theme.accent} sw={1.8} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>בנזין 95</div>
              <div style={{ fontSize: 12, color: theme.ink2, marginTop: 6 }}>נעול לרכב הזה — לא תוכל לתדלק דלק אחר</div>
            </Card>
            <div style={{ marginTop: 12, padding: 14, borderRadius: 14, background: theme.accent + '10', border: `1px solid ${theme.accent}30`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <IconShield size={18} stroke={theme.accent} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent, marginBottom: 2 }}>הגנה אוטומטית</div>
                <div style={{ fontSize: 12, color: theme.ink2, lineHeight: 1.4 }}>מונע תדלוק בסוג דלק לא מתאים שעלול לגרום נזק יקר למנוע.</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Card theme={theme} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 30, borderRadius: 6, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontFamily: MONO_FONT, letterSpacing: 0.5 }}>VISA</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: MONO_FONT }}>•••• 4829</div>
                    <div style={{ fontSize: 11, color: theme.ink2 }}>ברירת מחדל</div>
                  </div>
                </div>
                <IconCheck size={18} stroke={theme.success} />
              </div>
            </Card>
            <button onClick={() => nav('wallet')} style={{
              width: '100%', padding: 14, background: theme.surface, border: `1.5px dashed ${theme.ink}20`,
              borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, color: theme.ink2, fontFamily: HE_FONT, fontSize: 14, fontWeight: 600,
            }}><IconPlus size={16} /> הוסף אמצעי תשלום</button>
            <div style={{ marginTop: 20, fontSize: 12, color: theme.ink2, display: 'flex', gap: 8, alignItems: 'center' }}>
              <IconLock size={14} /> תשלומים מוצפנים | PCI-DSS | Tokenized
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 20, position: 'sticky', bottom: 0, background: `linear-gradient(180deg, transparent, ${theme.bg} 40%)` }}>
        <Button theme={theme} full disabled={step === 0 && !plateFound} onClick={() => (step < 2 ? setStep(step + 1) : nav('home'))}>
          {step < 2 ? 'המשך' : 'סיום | למסך הבית'}
        </Button>
      </div>
    </PhoneScreen>
  );
}
