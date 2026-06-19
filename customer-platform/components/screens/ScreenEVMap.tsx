import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, StatTile, Pill, Button } from '../primitives';
import { IconBolt, IconNavigate } from '../Icons';

export default function ScreenEVMap({ theme, nav }: ScreenProps) {
  const markers = [
    { x: '25%', y: '45%', k: 'סטנדרט', hi: false },
    { x: '60%', y: '35%', k: 'מהיר', hi: true },
    { x: '75%', y: '60%', k: 'מהיר', hi: false },
  ];
  return (
    <PhoneScreen theme={theme} bg={theme.ink} fill>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0A0C13 0%, #131824 100%)' }}>
          <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="ev-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="800" fill="url(#ev-grid)" />
            <path d="M0 400 Q150 350, 400 420" stroke="rgba(255,255,255,0.12)" strokeWidth="20" fill="none" />
            <path d="M200 0 L220 800" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
            <path d="M0 500 L400 520" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
          </svg>
          {markers.map((m, i) => (
            <div key={i} style={{ position: 'absolute', left: m.x, top: m.y, transform: 'translate(-50%,-50%)' }}>
              <div style={{
                width: m.hi ? 56 : 40, height: m.hi ? 56 : 40, borderRadius: '50%',
                background: m.hi ? theme.evGrad : 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff',
                boxShadow: m.hi ? `0 0 0 8px ${theme.ev}33, 0 6px 20px ${theme.ev}55` : 'none',
              }}>
                <IconBolt size={m.hi ? 22 : 16} stroke="#fff" sw={2.2} />
              </div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: '40%', top: '70%', width: 18, height: 18, borderRadius: '50%', background: '#0080FF', border: '3px solid #fff', boxShadow: '0 0 0 8px rgba(0,128,255,0.3)' }} />
        </div>

        <TopBar theme={{ ...theme, ink: '#fff', line: 'rgba(255,255,255,0.1)' }} title="עמדות טעינה" onBack={() => nav('home')} />

        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, padding: '0 12px', direction: 'rtl' }}>
          <Card theme={theme} style={{ background: theme.surface, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.evGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBolt size={22} stroke="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>GSM רוטשילד | עמדה 3</div>
                <div style={{ fontSize: 12, color: theme.ink2, fontFamily: MONO_FONT }}>350 kW | DC | פנויה | 380 מ׳</div>
              </div>
              <Pill theme={theme} style={{ background: theme.ev + '18', color: theme.ev }}>מהיר</Pill>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <StatTile theme={theme} label="מחיר" value="85" unit="אגורות/kWh" />
              <StatTile theme={theme} label="הספק" value="350" unit="kW" accent={theme.ev} />
              <StatTile theme={theme} label="זמן" value="~18" unit="דק׳" />
            </div>
            <Button theme={theme} variant="ev" full onClick={() => nav('ev_live')} icon={<IconNavigate size={16} stroke="#fff" />}>
              נווט והתחל טעינה
            </Button>
          </Card>
        </div>
      </div>
    </PhoneScreen>
  );
}
