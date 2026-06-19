import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, Button, StatTile } from '../primitives';
import { IconCar, IconFuel } from '../Icons';

export default function ScreenArrival({ theme, nav }: ScreenProps) {
  return (
    <PhoneScreen theme={theme} bg={theme.ink} fill>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(80% 50% at 50% 20%, ${theme.accent}44 0%, transparent 60%), #0A0C13` }}>
          <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.25 }}>
            <rect x="40" y="200" width="320" height="12" fill={theme.accent} />
            <rect x="50" y="212" width="8" height="120" fill="#fff" opacity="0.4" />
            <rect x="342" y="212" width="8" height="120" fill="#fff" opacity="0.4" />
            <rect x="100" y="340" width="40" height="90" fill="#fff" opacity="0.3" rx="4" />
            <rect x="180" y="340" width="40" height="90" fill="#fff" opacity="0.3" rx="4" />
            <rect x="260" y="340" width="40" height="90" fill="#fff" opacity="0.3" rx="4" />
            <rect x="0" y="450" width="400" height="350" fill="#000" opacity="0.4" />
          </svg>
        </div>

        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 100,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: 12, fontFamily: MONO_FONT, letterSpacing: 1,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent, animation: 'gsm-pulse 1.2s infinite' }} />
            ALPR | זיהוי לוחית רישוי
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 60, left: 0, right: 0, background: theme.surface, borderRadius: 28,
          padding: '14px 20px 24px', direction: 'rtl', boxShadow: '0 -30px 80px rgba(0,0,0,0.4)', margin: '0 12px',
        }}>
          <div style={{ width: 42, height: 5, borderRadius: 100, background: theme.ink + '20', margin: '0 auto 18px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.accent}40` }}>
              <IconCar size={26} stroke={theme.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: theme.accent, fontFamily: MONO_FONT, letterSpacing: 1, fontWeight: 700 }}>ברוכה השבה, שרה</div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>זיהינו את הרכב שלך</div>
            </div>
          </div>
          <div style={{ background: '#FFD93A', borderRadius: 12, padding: '10px 16px', color: '#111', fontFamily: MONO_FONT, fontSize: 22, fontWeight: 800, letterSpacing: 2, textAlign: 'center', border: '2px solid #111', marginBottom: 18 }}>52-847-91</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <StatTile theme={theme} label="תחנה" value="04" unit="רוטשילד" />
            <StatTile theme={theme} label="משאבה" value="07" unit="פנויה" accent={theme.success} />
            <StatTile theme={theme} label="דלק" value="95" unit="נעול" accent={theme.accent} />
          </div>
          <Button theme={theme} full onClick={() => nav('fuel_setup')} icon={<IconFuel size={18} stroke="#fff" />}>
            התחל תדלוק מהרכב
          </Button>
          <button onClick={() => nav('home')} style={{ width: '100%', marginTop: 10, padding: 14, background: 'transparent', border: 'none', color: theme.ink2, fontSize: 14, fontFamily: HE_FONT, cursor: 'pointer' }}>לא עכשיו</button>
        </div>
      </div>
    </PhoneScreen>
  );
}
