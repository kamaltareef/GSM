import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, Button } from '../primitives';
import { IconArrowRight } from '../Icons';

export default function ScreenSplash({ theme, nav }: ScreenProps) {
  return (
    <PhoneScreen theme={theme} bg={theme.ink} fill>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: '50%', background: theme.accent, opacity: 0.18, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: 100, left: -80, width: 280, height: 280, borderRadius: '50%', background: theme.accent2, opacity: 0.14, filter: 'blur(50px)' }} />
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          <defs>
            <pattern id="sp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#fff" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sp-grid)" />
        </svg>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
          <line x1="0" y1="300" x2="400" y2="100" stroke={theme.accent} strokeWidth="1" />
          <line x1="0" y1="340" x2="400" y2="140" stroke={theme.accent} strokeWidth="0.5" />
        </svg>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', color: '#fff' }}>
        <div style={{ height: 56 }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
            <rect x="20" y="60" width="220" height="8" rx="4" fill={theme.accent} opacity="0.9" />
            <rect x="32" y="68" width="6" height="90" rx="3" fill="#fff" opacity="0.3" />
            <rect x="222" y="68" width="6" height="90" rx="3" fill="#fff" opacity="0.3" />
            <rect x="60" y="100" width="38" height="58" rx="6" fill="#fff" opacity="0.08" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.2" />
            <rect x="66" y="108" width="26" height="18" rx="3" fill={theme.accent} opacity="0.6" />
            <circle cx="79" cy="140" r="6" fill="none" stroke={theme.accent} strokeWidth="1.5" />
            <rect x="111" y="95" width="38" height="63" rx="6" fill={theme.accent} opacity="0.18" stroke={theme.accent} strokeWidth="1.2" />
            <rect x="117" y="103" width="26" height="18" rx="3" fill={theme.accent} opacity="0.9" />
            <circle cx="130" cy="140" r="7" fill={theme.accent} opacity="0.8" />
            <line x1="200" y1="158" x2="200" y2="90" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="200" y1="90" x2="158" y2="110" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" />
            <line x1="158" y1="110" x2="148" y2="126" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="200" cy="158" r="5" fill={theme.accent} />
            <circle cx="200" cy="90" r="4" fill={theme.accent} opacity="0.7" />
            <circle cx="158" cy="110" r="3.5" fill={theme.accent} opacity="0.7" />
            <path d="M68 175 L78 160 Q82 154 90 154 H168 Q176 154 180 160 L190 175 Z" fill="#fff" opacity="0.12" />
            <rect x="64" y="172" width="130" height="8" rx="3" fill="#fff" opacity="0.1" />
            <circle cx="86" cy="180" r="7" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="172" cy="180" r="7" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="4" y="140" width="42" height="22" rx="6" fill={theme.ev} opacity="0.9" />
            <text x="18" y="155" fontFamily="monospace" fontSize="8" fill="#fff" fontWeight="700">EV</text>
            <circle cx="246" cy="68" r="5" fill="#FF3A3A">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <text x="222" y="57" fontFamily="monospace" fontSize="7" fill={theme.accent} letterSpacing="1" opacity="0.8">LIVE</text>
          </svg>
        </div>

        <div style={{ padding: '0 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${theme.accent}66)` }} />
            <div style={{ fontSize: 10, fontFamily: MONO_FONT, opacity: 0.55, letterSpacing: 2 }}>GAS STATION MANAGEMENT</div>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${theme.accent}66, transparent)` }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1, marginBottom: 12 }}>
            מהעבר המייגע<br />
            <span style={{ background: theme.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>אל תחנת העתיד.</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
            תדלוק אוטונומי, זיהוי רכב בכניסה<br />ותשלום ללא מגע — הכל מהמושב.
          </div>
          <Button theme={theme} full onClick={() => nav('register')} style={{ marginBottom: 12 }}>
            התחל <IconArrowRight size={18} />
          </Button>
          <button onClick={() => nav('home')} style={{
            width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16, color: '#fff', padding: 14, fontSize: 14,
            fontFamily: HE_FONT, fontWeight: 600, cursor: 'pointer', opacity: 0.75,
          }}>יש לי כבר חשבון</button>
        </div>
      </div>
    </PhoneScreen>
  );
}
