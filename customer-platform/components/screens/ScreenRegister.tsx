'use client';

import { useState } from 'react';
import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Button } from '../primitives';
import { IconCheck, IconShield, IconArrowRight } from '../Icons';

export default function ScreenRegister({ theme, nav }: ScreenProps) {
  const [idNum, setIdNum] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateId = (id: string) => {
    const d = id.replace(/\D/g, '');
    if (d.length !== 9) return false;
    let total = 0;
    for (let i = 0; i < 9; i++) {
      let x = +d[i] * ((i % 2) + 1);
      if (x > 9) x -= 9;
      total += x;
    }
    return total % 10 === 0;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validateId(idNum)) e.id = 'תעודת זהות לא תקינה';
    if (!fullName.trim()) e.name = 'שם מלא נדרש';
    if (!/^05\d{8}$/.test(phone.replace(/[-\s]/g, ''))) e.phone = 'מספר טלפון ישראלי נדרש';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'כתובת דוא"ל לא תקינה';
    return e;
  };

  const handleSubmit = () => {
    setTouched({ id: true, name: true, phone: true, email: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) nav('onboard');
  };

  const idOk = touched.id && validateId(idNum);

  const fieldBorder = (f: string) =>
    touched[f] && errors[f] ? '#D93030' :
    touched[f] && !errors[f] ? theme.success :
    theme.line;

  const baseInput: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 14, fontSize: 15,
    background: theme.surface, color: theme.ink, fontFamily: HE_FONT,
    outline: 'none', boxSizing: 'border-box', direction: 'rtl',
    transition: 'border-color 0.2s',
  };

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="הרשמה" onBack={() => nav('splash')} />
      <div style={{ padding: '0 20px 100px' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 6 }}>
            יצירת חשבון GSM
          </div>
          <div style={{ fontSize: 14, color: theme.ink2, lineHeight: 1.6 }}>
            הרשמה מהירה עם תעודת זהות ישראלית. המידע שלך מוצפן ומאובטח.
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontFamily: MONO_FONT, letterSpacing: 0.8, marginBottom: 8, color: theme.accent, fontWeight: 700 }}>תעודת זהות *</div>
          <div style={{ position: 'relative' }}>
            <input
              type="text" inputMode="numeric" maxLength={9} value={idNum}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 9);
                setIdNum(v);
                if (touched.id) setErrors(prev => ({ ...prev, id: validateId(v) ? undefined : 'תעודת זהות לא תקינה' }));
              }}
              onBlur={() => {
                setTouched(t => ({ ...t, id: true }));
                setErrors(prev => ({ ...prev, id: validateId(idNum) ? undefined : 'תעודת זהות לא תקינה' }));
              }}
              placeholder="000000000"
              style={{
                ...baseInput, direction: 'ltr', textAlign: 'center', fontSize: 26,
                fontFamily: MONO_FONT, letterSpacing: 5, padding: '14px 50px',
                border: `2px solid ${idOk ? theme.success : touched.id && errors.id ? '#D93030' : theme.accent}`,
                background: theme.gradSoft,
              }}
            />
            {idOk && (
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                <IconCheck size={22} stroke={theme.success} sw={3} />
              </div>
            )}
          </div>
          {touched.id && errors.id && <div style={{ fontSize: 11, color: '#D93030', marginTop: 5, fontFamily: MONO_FONT }}>✕ {errors.id}</div>}
          {idOk && <div style={{ fontSize: 11, color: theme.success, marginTop: 5, fontFamily: MONO_FONT }}>✓ תעודת זהות אומתה</div>}
        </div>

        <div style={{ marginBottom: 20, padding: 12, borderRadius: 12, background: theme.accent + '0E', border: `1px solid ${theme.accent}25`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <IconShield size={16} stroke={theme.accent} />
          <div style={{ fontSize: 12, color: theme.ink2, lineHeight: 1.5 }}>
            תעודת הזהות משמשת לאימות זהות וחיבור לרשומות הרכב בלבד. לא נשמרת ולא מועברת לצד שלישי.
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontFamily: MONO_FONT, letterSpacing: 0.5, marginBottom: 6, color: theme.ink2 }}>שם מלא *</div>
          <input
            type="text" value={fullName}
            onChange={e => {
              setFullName(e.target.value);
              if (touched.name) setErrors(prev => ({ ...prev, name: e.target.value.trim() ? undefined : 'שם מלא נדרש' }));
            }}
            onBlur={() => {
              setTouched(t => ({ ...t, name: true }));
              setErrors(prev => ({ ...prev, name: fullName.trim() ? undefined : 'שם מלא נדרש' }));
            }}
            placeholder="ישראל ישראלי"
            style={{ ...baseInput, border: `1.5px solid ${fieldBorder('name')}` }}
          />
          {touched.name && errors.name && <div style={{ fontSize: 11, color: '#D93030', marginTop: 4, fontFamily: MONO_FONT }}>✕ {errors.name}</div>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontFamily: MONO_FONT, letterSpacing: 0.5, marginBottom: 6, color: theme.ink2 }}>מספר טלפון *</div>
          <input
            type="tel" value={phone}
            onChange={e => setPhone(e.target.value)}
            onBlur={() => {
              setTouched(t => ({ ...t, phone: true }));
              const p = phone.replace(/[-\s]/g, '');
              setErrors(prev => ({ ...prev, phone: /^05\d{8}$/.test(p) ? undefined : 'מספר טלפון ישראלי נדרש (05X-XXXXXXX)' }));
            }}
            placeholder="050-0000000"
            style={{ ...baseInput, direction: 'ltr', textAlign: 'right', border: `1.5px solid ${fieldBorder('phone')}` }}
          />
          {touched.phone && errors.phone && <div style={{ fontSize: 11, color: '#D93030', marginTop: 4, fontFamily: MONO_FONT }}>✕ {errors.phone}</div>}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontFamily: MONO_FONT, letterSpacing: 0.5, marginBottom: 6, color: theme.ink2 }}>דוא&quot;ל *</div>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => {
              setTouched(t => ({ ...t, email: true }));
              setErrors(prev => ({ ...prev, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : 'כתובת דוא"ל לא תקינה' }));
            }}
            placeholder="israel@gmail.com"
            style={{ ...baseInput, direction: 'ltr', textAlign: 'right', border: `1.5px solid ${fieldBorder('email')}` }}
          />
          {touched.email && errors.email && <div style={{ fontSize: 11, color: '#D93030', marginTop: 4, fontFamily: MONO_FONT }}>✕ {errors.email}</div>}
        </div>

        <div style={{ fontSize: 11, color: theme.ink3, lineHeight: 1.6 }}>
          בהרשמה אתה מסכים ל<span style={{ color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>תנאי השימוש</span> ול<span style={{ color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>מדיניות הפרטיות</span> של GSM.
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', position: 'sticky', bottom: 0, background: `linear-gradient(180deg, transparent, ${theme.bg} 40%)` }}>
        <Button theme={theme} full onClick={handleSubmit} icon={<IconArrowRight size={18} />}>
          המשך לאימות רכב
        </Button>
      </div>
    </PhoneScreen>
  );
}
