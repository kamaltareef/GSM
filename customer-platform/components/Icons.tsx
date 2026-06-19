// Custom SVG icons — line-style, consistent 1.6 stroke
import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
  stroke?: string;
  fill?: string;
  sw?: number;
  d?: string;
  children?: ReactNode;
}

export const Icon = ({ d, size = 24, stroke = 'currentColor', fill = 'none', sw = 1.6, children }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d} />}
    {children}
  </svg>
);

export const IconFuel = (p: IconProps) => <Icon {...p}><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" /><path d="M3 21h12" /><path d="M14 9h2a2 2 0 0 1 2 2v5a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V8l-2.5-2.5" /><path d="M6 7h6" /></Icon>;
export const IconBolt = (p: IconProps) => <Icon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></Icon>;
export const IconMap = (p: IconProps) => <Icon {...p}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15" /><path d="M15 6v15" /></Icon>;
export const IconCar = (p: IconProps) => <Icon {...p}><path d="M5 14 7 7a2 2 0 0 1 2-1.5h6a2 2 0 0 1 2 1.5l2 7" /><path d="M3 14h18v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="16.5" r="1" /><circle cx="16.5" cy="16.5" r="1" /></Icon>;
export const IconWallet = (p: IconProps) => <Icon {...p}><path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 7V6a2 2 0 0 1 2-2h11" /><circle cx="16" cy="13" r="1.5" fill="currentColor" /></Icon>;
export const IconClock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
export const IconUser = (p: IconProps) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Icon>;
export const IconBell = (p: IconProps) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3z" /><path d="M10 19a2 2 0 0 0 4 0" /></Icon>;
export const IconCheck = (p: IconProps) => <Icon {...p}><path d="m5 12 5 5L20 7" /></Icon>;
export const IconChevron = (p: IconProps) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
export const IconChevronL = (p: IconProps) => <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>;
export const IconChevronD = (p: IconProps) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const IconPlus = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const IconSearch = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>;
export const IconSettings = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Icon>;
export const IconCoffee = (p: IconProps) => <Icon {...p}><path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M17 10h2a2 2 0 0 1 0 5h-2" /><path d="M8 2v3M12 2v3M16 2v3" /></Icon>;
export const IconGift = (p: IconProps) => <Icon {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" /><path d="M8 8a2 2 0 1 1 0-4c2 0 4 4 4 4s2-4 4-4a2 2 0 1 1 0 4" /></Icon>;
export const IconReceipt = (p: IconProps) => <Icon {...p}><path d="M5 3h14v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M9 8h6M9 12h6M9 16h4" /></Icon>;
export const IconQR = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" /></Icon>;
export const IconLock = (p: IconProps) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
export const IconShield = (p: IconProps) => <Icon {...p}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z" /><path d="m9 12 2 2 4-4" /></Icon>;
export const IconDroplet = (p: IconProps) => <Icon {...p}><path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" /></Icon>;
export const IconArrowRight = (p: IconProps) => <Icon {...p}><path d="M5 12h14m-6-6 6 6-6 6" /></Icon>;
export const IconHome = (p: IconProps) => <Icon {...p}><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Icon>;
export const IconNavigate = (p: IconProps) => <Icon {...p}><path d="M3 11 21 3l-8 18-2-7z" /></Icon>;
