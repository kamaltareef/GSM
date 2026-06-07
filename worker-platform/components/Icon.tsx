interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = 'currentColor' }: IconProps) {
  const icons: Record<string, React.ReactNode> = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    orders: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    shifts: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8"/><path d="M3 9h18M8 2v4M16 2v4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    profile: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/><path d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    back: <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9v5M12 16.5v.5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    wrench: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    fingerprint: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2C9.4 2 7 3 5.2 4.8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M2.7 10.2A10 10 0 0012 22a10 10 0 009.4-6.6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 6a6 6 0 016 6c0 2.1-.5 4.1-1.4 5.8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M6.4 11a6 6 0 01.5-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 10a2 2 0 012 2c0 2.5-.5 4.9-1.4 7" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 10a2 2 0 00-2 2c0 1.5.2 3 .6 4.4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    swap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return <>{icons[name] || null}</>;
}
