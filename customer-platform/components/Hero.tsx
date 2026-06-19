'use client';

// Hero fueling visuals — 3 variants selectable via settings
// (illustration | photo | livecam)
import { useState, useEffect } from 'react';
import { type Theme, type HeroVariant } from '@/lib/theme';

interface HeroProps {
  theme: Theme;
  progress?: number;
  evMode?: boolean;
}

const HeroIllustration = ({ theme, progress = 0.42, evMode = false }: HeroProps) => {
  const t = theme;
  const accent = evMode ? t.ev : t.accent;
  return (
    <div style={{
      position: 'relative', height: 280, borderRadius: 24,
      background: `radial-gradient(120% 80% at 50% 0%, ${accent}22 0%, transparent 60%), ${t.surfaceAlt}`,
      overflow: 'hidden', border: `1px solid ${t.line}`,
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 70, height: 1,
        background: `linear-gradient(90deg, transparent, ${t.ink}20, transparent)`,
      }} />
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)' }}>
        <defs>
          <linearGradient id={`gsm-grad-${evMode ? 'ev' : 'fuel'}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={evMode ? '#3DBE8B' : '#FF5E3A'} />
            <stop offset="1" stopColor={evMode ? '#7CFFB2' : '#FFB83A'} />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r="76" fill="none" stroke={t.line} strokeWidth="6" />
        <circle cx="90" cy="90" r="76" fill="none"
          stroke={`url(#gsm-grad-${evMode ? 'ev' : 'fuel'})`} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 76}`}
          strokeDashoffset={`${2 * Math.PI * 76 * (1 - progress)}`}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        <g transform="translate(90 90)">
          {evMode ? (
            <path d="M-4 -22 L-12 4 L-2 4 L-6 22 L12 -6 L2 -6 L6 -22 Z" fill={`url(#gsm-grad-ev)`} />
          ) : (
            <g fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-12 22 V-16 a6 6 0 0 1 6 -6 h10 a6 6 0 0 1 6 6 V22" />
              <path d="M-14 22 H12" />
              <path d="M10 -4 h6 a4 4 0 0 1 4 4 v12 a2 2 0 0 0 4 0 V-8 L20 -14" />
            </g>
          )}
        </g>
      </svg>
      <svg width="100%" height="90" viewBox="0 0 360 90" style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <rect x="0" y="70" width="360" height="20" fill={t.ink + '08'} />
        <g fill={t.ink} opacity="0.9">
          <path d="M60 72 L70 50 Q75 42 85 42 L145 42 Q155 42 160 50 L170 72 Z" />
          <rect x="56" y="68" width="118" height="8" rx="2" />
          <circle cx="78" cy="78" r="6" fill={t.surface} stroke={t.ink} strokeWidth="1.5" />
          <circle cx="152" cy="78" r="6" fill={t.surface} stroke={t.ink} strokeWidth="1.5" />
          <path d="M78 52 L90 45 H140 L152 52 Z" fill={t.surface} opacity="0.9" />
        </g>
        <g stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round">
          <line x1="250" y1="72" x2="250" y2="20" />
          <line x1="250" y1="20" x2="200" y2="40" />
          <line x1="200" y1="40" x2="174" y2="56" />
          <circle cx="250" cy="72" r="6" fill={accent} />
          <circle cx="250" cy="20" r="4" fill={accent} />
          <circle cx="200" cy="40" r="4" fill={accent} />
          <circle cx="174" cy="56" r="3" fill={accent} />
        </g>
        <circle cx="168" cy="62" r="2" fill={accent}>
          <animate attributeName="cy" values="58;68;58" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div style={{
        position: 'absolute', top: 14, right: 14, padding: '4px 10px', borderRadius: 100,
        background: accent, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
        display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-jetbrains), monospace',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'gsm-pulse 1.4s ease-in-out infinite' }} />
        LIVE
      </div>
    </div>
  );
};

const HeroPhoto = ({ theme, progress = 0.42, evMode = false }: HeroProps) => {
  const t = theme;
  const accent = evMode ? t.ev : t.accent;
  return (
    <div style={{
      position: 'relative', height: 280, borderRadius: 24, overflow: 'hidden',
      border: `1px solid ${t.line}`,
      background: `repeating-linear-gradient(135deg, ${t.ink}06 0 14px, ${t.ink}0A 14px 28px)`,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${t.surface}F0 100%)` }} />
      <div style={{
        position: 'absolute', top: 18, left: 18,
        fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10,
        color: t.ink2, letterSpacing: 0.5, lineHeight: 1.6,
      }}>
        <div>[ PHOTO ]</div>
        <div style={{ color: t.ink3 }}>robotic arm — pump 04</div>
        <div style={{ color: t.ink3 }}>ratio 4:3 · drop real photo</div>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: t.ink, letterSpacing: 0.3 }}>
          <span>{evMode ? 'EV FAST CHARGE' : 'FUEL FLOW'}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 100, background: t.ink + '15', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: accent, transition: 'width 0.6s' }} />
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 14, right: 14, padding: '4px 10px', borderRadius: 100,
        background: accent, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
        fontFamily: 'var(--font-jetbrains), monospace',
      }}>{evMode ? 'EV' : '95 OCTANE'}</div>
    </div>
  );
};

const HeroLiveCam = ({ theme, progress = 0.42, evMode = false }: HeroProps) => {
  const t = theme;
  const accent = evMode ? t.ev : t.accent;
  const [ts, setTs] = useState<Date | null>(null);
  useEffect(() => {
    setTs(new Date());
    const id = setInterval(() => setTs(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = ts ? ts.toTimeString().slice(0, 8) : '--:--:--';
  const corners: ('tl' | 'tr' | 'bl' | 'br')[] = ['tl', 'tr', 'bl', 'br'];
  return (
    <div style={{ position: 'relative', height: 280, borderRadius: 24, overflow: 'hidden', background: '#0B0D14', border: `1px solid ${t.line}` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)' }} />
      <svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        <rect x="20" y="40" width="320" height="200" fill="none" stroke="#4a5268" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="100" y1="240" x2="100" y2="40" stroke="#4a5268" strokeWidth="0.5" />
        <line x1="260" y1="240" x2="260" y2="40" stroke="#4a5268" strokeWidth="0.5" />
        <circle cx="180" cy="180" r="40" fill="none" stroke="#4a5268" strokeWidth="0.5" />
        <g fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7">
          <path d="M100 200 L115 170 Q120 162 130 162 H220 Q230 162 235 170 L250 200 Z" />
          <line x1="100" y1="205" x2="250" y2="205" />
        </g>
        <g fill="none" stroke={accent} strokeWidth="1.5">
          <line x1="290" y1="200" x2="290" y2="90" />
          <line x1="290" y1="90" x2="240" y2="110" />
          <line x1="240" y1="110" x2="218" y2="135" />
          <circle cx="290" cy="200" r="4" fill={accent} />
          <circle cx="290" cy="90" r="3" fill={accent} />
          <circle cx="240" cy="110" r="3" fill={accent} />
        </g>
      </svg>
      {corners.map((p, i) => {
        const pos = { tl: { top: 14, left: 14 }, tr: { top: 14, right: 14 }, bl: { bottom: 14, left: 14 }, br: { bottom: 14, right: 14 } }[p];
        const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[p];
        return (
          <svg key={i} width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', ...pos, transform: `rotate(${rot}deg)` }}>
            <path d="M2 10 V2 H10" stroke={accent} strokeWidth="2" fill="none" />
          </svg>
        );
      })}
      <div style={{
        position: 'absolute', top: 16, left: 16, color: accent,
        fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: 0.5,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3A3A', animation: 'gsm-pulse 1s infinite' }} />
        REC · CAM-04
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, color: accent, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: 1 }}>{timeStr}</div>
      <div style={{
        position: 'absolute', bottom: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        color: accent, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: 0.5,
      }}>
        <div>
          <div style={{ opacity: 0.6 }}>{evMode ? 'KW OUT' : 'L/MIN'}</div>
          <div style={{ fontSize: 22, color: '#fff', letterSpacing: 1 }}>{evMode ? '47.2' : '38.4'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ opacity: 0.6 }}>PROGRESS</div>
          <div style={{ fontSize: 22, color: '#fff' }}>{Math.round(progress * 100)}%</div>
        </div>
      </div>
    </div>
  );
};

export default function Hero({ variant = 'illustration', ...props }: HeroProps & { variant?: HeroVariant }) {
  if (variant === 'photo') return <HeroPhoto {...props} />;
  if (variant === 'livecam') return <HeroLiveCam {...props} />;
  return <HeroIllustration {...props} />;
}
