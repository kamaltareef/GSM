// GSM brand tokens, RTL-first.
// Hebrew is the primary language. Warm sunset gradient + deep midnight navy.

export interface Theme {
  name: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  accent: string;
  accent2: string;
  grad: string;
  gradSoft: string;
  success: string;
  ev: string;
  evGrad: string;
  ring: string;
}

export type ThemeKey = 'sunset' | 'midnight' | 'branded';
export type HeroVariant = 'illustration' | 'photo' | 'livecam';

export type ScreenKey =
  | 'splash' | 'register' | 'onboard' | 'home' | 'arrival'
  | 'fuel_setup' | 'fuel_live' | 'fuel_done' | 'ev_map' | 'ev_live'
  | 'ev_receipt' | 'store' | 'store_done' | 'history' | 'wallet'
  | 'profile' | 'map' | 'notifications';

export interface AppState {
  amount: number;
  evMode: boolean;
}

export interface ScreenProps {
  theme: Theme;
  nav: (key: ScreenKey) => void;
  state: AppState;
  setState: (s: AppState) => void;
  heroVariant: HeroVariant;
}

export const GSM_THEMES: Record<ThemeKey, Theme> = {
  sunset: {
    name: 'שקיעה',
    bg: '#F7F1EA',
    surface: '#FFFFFF',
    surfaceAlt: '#FBF5EC',
    ink: '#1A1410',
    ink2: '#6B5E52',
    ink3: '#A89C8E',
    line: 'rgba(26, 20, 16, 0.08)',
    accent: '#FF5E3A',
    accent2: '#FFB83A',
    grad: 'linear-gradient(135deg, #FF5E3A 0%, #FFB83A 100%)',
    gradSoft: 'linear-gradient(135deg, rgba(255,94,58,0.12) 0%, rgba(255,184,58,0.12) 100%)',
    success: '#2B8A4C',
    ev: '#3DBE8B',
    evGrad: 'linear-gradient(135deg, #3DBE8B 0%, #86E5B8 100%)',
    ring: 'rgba(255, 94, 58, 0.22)',
  },
  midnight: {
    name: 'חצות',
    bg: '#0B0D14',
    surface: '#13161F',
    surfaceAlt: '#1A1E2A',
    ink: '#F5F2EC',
    ink2: '#A8A3A0',
    ink3: '#6B6763',
    line: 'rgba(245, 242, 236, 0.08)',
    accent: '#FF7A4F',
    accent2: '#FFC36B',
    grad: 'linear-gradient(135deg, #FF7A4F 0%, #FFC36B 100%)',
    gradSoft: 'linear-gradient(135deg, rgba(255,122,79,0.18) 0%, rgba(255,195,107,0.14) 100%)',
    success: '#7CFFB2',
    ev: '#7CFFB2',
    evGrad: 'linear-gradient(135deg, #3DBE8B 0%, #7CFFB2 100%)',
    ring: 'rgba(255, 122, 79, 0.3)',
  },
  branded: {
    name: 'ממותג',
    bg: '#FFE8DC',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF3E8',
    ink: '#2A0F05',
    ink2: '#7A3A1E',
    ink3: '#B8826A',
    line: 'rgba(42, 15, 5, 0.1)',
    accent: '#E8391A',
    accent2: '#FFA82A',
    grad: 'linear-gradient(135deg, #E8391A 0%, #FFA82A 100%)',
    gradSoft: 'linear-gradient(135deg, rgba(232,57,26,0.15) 0%, rgba(255,168,42,0.15) 100%)',
    success: '#1F7A3A',
    ev: '#2B8A4C',
    evGrad: 'linear-gradient(135deg, #2B8A4C 0%, #86E5B8 100%)',
    ring: 'rgba(232, 57, 26, 0.25)',
  },
};

export const HE_FONT = "'Heebo', 'Rubik', 'Assistant', -apple-system, sans-serif";
export const MONO_FONT = "'JetBrains Mono', 'Menlo', ui-monospace, monospace";

// Currency formatter
export const ils = (n: number) =>
  new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(n);
