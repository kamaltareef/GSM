// Shared app primitives for GSM screens (RTL Hebrew)
import type { CSSProperties, ReactNode } from 'react';
import { type Theme, type ScreenKey, HE_FONT, MONO_FONT } from '@/lib/theme';
import { IconHome, IconMap, IconWallet, IconUser, IconChevron } from './Icons';

export const Pill = ({
  children, theme, variant = 'default', style, onClick,
}: {
  children: ReactNode; theme: Theme;
  variant?: 'default' | 'accent' | 'ev' | 'outline';
  style?: CSSProperties; onClick?: () => void;
}) => {
  const t = theme;
  const styles: Record<string, CSSProperties> = {
    default: { background: t.ink + '08', color: t.ink },
    accent: { background: t.grad, color: '#fff' },
    ev: { background: t.evGrad, color: '#fff' },
    outline: { background: 'transparent', color: t.ink, border: `1px solid ${t.line}` },
  };
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
      border: 'none', cursor: onClick ? 'pointer' : 'default',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: HE_FONT, ...styles[variant], ...style,
    }}>{children}</button>
  );
};

export const Button = ({
  children, theme, variant = 'primary', full, onClick, style, icon, disabled,
}: {
  children: ReactNode; theme: Theme;
  variant?: 'primary' | 'ev' | 'dark' | 'outline' | 'ghost';
  full?: boolean; onClick?: () => void; style?: CSSProperties;
  icon?: ReactNode; disabled?: boolean;
}) => {
  const t = theme;
  const base: CSSProperties = {
    height: 56, borderRadius: 18, fontSize: 17, fontWeight: 700,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '0 24px', width: full ? '100%' : undefined, fontFamily: HE_FONT,
    opacity: disabled ? 0.5 : 1, transition: 'transform 0.1s',
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: t.grad, color: '#fff', boxShadow: `0 8px 24px ${t.ring}` },
    ev: { background: t.evGrad, color: '#fff', boxShadow: `0 8px 24px ${t.ev}55` },
    dark: { background: t.ink, color: t.surface },
    outline: { background: 'transparent', color: t.ink, border: `1.5px solid ${t.ink}20` },
    ghost: { background: t.ink + '08', color: t.ink },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}>
      {icon}{children}
    </button>
  );
};

export const Card = ({
  children, theme, padded = true, style,
}: {
  children: ReactNode; theme: Theme; padded?: boolean; style?: CSSProperties;
}) => (
  <div style={{
    background: theme.surface, borderRadius: 20,
    padding: padded ? 20 : 0, border: `1px solid ${theme.line}`, ...style,
  }}>{children}</div>
);

export const StatTile = ({
  label, value, unit, theme, accent,
}: {
  label: string; value: ReactNode; unit?: ReactNode; theme: Theme; accent?: string;
}) => (
  <div style={{
    padding: '14px 16px', borderRadius: 16, background: theme.surfaceAlt,
    border: `1px solid ${theme.line}`, flex: 1,
  }}>
    <div style={{ fontSize: 11, color: theme.ink2, marginBottom: 4, letterSpacing: 0.2 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent || theme.ink, fontFamily: MONO_FONT, letterSpacing: -0.5 }}>{value}</div>
      {unit && <div style={{ fontSize: 11, color: theme.ink2 }}>{unit}</div>}
    </div>
  </div>
);

export const Divider = ({ theme }: { theme: Theme }) => (
  <div style={{ height: 1, background: theme.line, margin: '16px 0' }} />
);

export const TabBar = ({
  theme, active, onNav,
}: {
  theme: Theme; active: ScreenKey; onNav: (k: ScreenKey) => void;
}) => {
  const tabs: { k: ScreenKey; label: string; icon: typeof IconHome }[] = [
    { k: 'home', label: 'בית', icon: IconHome },
    { k: 'map', label: 'מפה', icon: IconMap },
    { k: 'wallet', label: 'ארנק', icon: IconWallet },
    { k: 'profile', label: 'פרופיל', icon: IconUser },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto',
      padding: '10px 12px 30px',
      background: theme.surface + 'F2',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderTop: `1px solid ${theme.line}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      direction: 'rtl', zIndex: 20,
    }}>
      {tabs.map(t => {
        const Ic = t.icon;
        const isActive = active === t.k;
        return (
          <button key={t.k} onClick={() => onNav(t.k)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? theme.accent : theme.ink3, fontFamily: HE_FONT,
            padding: '4px 12px',
          }}>
            <Ic size={22} sw={isActive ? 2 : 1.6} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TopBar = ({
  theme, title, onBack, right, dark, style,
}: {
  theme: Theme; title: string; onBack?: () => void;
  right?: ReactNode; dark?: boolean; style?: CSSProperties;
}) => (
  <div style={{
    padding: '14px 16px', display: 'flex', alignItems: 'center',
    direction: 'rtl', gap: 12, position: 'relative', zIndex: 10, flexShrink: 0,
    ...style,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 12, border: 'none',
        background: dark ? 'rgba(255,255,255,0.12)' : theme.ink + '08',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme.ink,
      }}>
        <IconChevron size={18} />
      </button>
    )}
    <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: theme.ink, fontFamily: HE_FONT }}>{title}</div>
    {right}
  </div>
);

export const Section = ({
  title, subtitle, right, theme, children,
}: {
  title: string; subtitle?: string; right?: ReactNode; theme: Theme; children: ReactNode;
}) => (
  <div style={{ padding: '20px 20px 8px', direction: 'rtl' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: subtitle ? 2 : 10 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: theme.ink, fontFamily: HE_FONT }}>{title}</div>
      {right}
    </div>
    {subtitle && <div style={{ fontSize: 13, color: theme.ink2, marginBottom: 10 }}>{subtitle}</div>}
    {children}
  </div>
);

export const PhoneScreen = ({
  theme, children, bg, pad = 0, fill = false,
}: {
  theme: Theme; children: ReactNode; bg?: string; pad?: number; fill?: boolean;
}) => (
  <div style={{
    position: 'relative',
    minHeight: fill ? '100%' : 'auto',
    height: fill ? '100%' : 'auto',
    flex: fill ? 1 : undefined,
    display: 'flex', flexDirection: 'column',
    background: bg || theme.bg, direction: 'rtl',
    fontFamily: HE_FONT, color: theme.ink, padding: pad,
  }}>{children}</div>
);
