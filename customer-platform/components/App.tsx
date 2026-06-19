'use client';

import { useState, useEffect, type ComponentType } from 'react';
import {
  GSM_THEMES, type ThemeKey, type HeroVariant, type ScreenKey,
  type ScreenProps, type AppState, HE_FONT, MONO_FONT,
} from '@/lib/theme';
import AndroidDevice from './AndroidDevice';

import ScreenSplash from './screens/ScreenSplash';
import ScreenRegister from './screens/ScreenRegister';
import ScreenOnboard from './screens/ScreenOnboard';
import ScreenHome from './screens/ScreenHome';
import ScreenArrival from './screens/ScreenArrival';
import ScreenFuelSetup from './screens/ScreenFuelSetup';
import ScreenFuelLive from './screens/ScreenFuelLive';
import ScreenReceipt from './screens/ScreenReceipt';
import ScreenEVMap from './screens/ScreenEVMap';
import ScreenEVLive from './screens/ScreenEVLive';
import ScreenEVReceipt from './screens/ScreenEVReceipt';
import ScreenStore from './screens/ScreenStore';
import ScreenStoreDone from './screens/ScreenStoreDone';
import ScreenHistory from './screens/ScreenHistory';
import ScreenWallet from './screens/ScreenWallet';
import ScreenProfile from './screens/ScreenProfile';
import ScreenMap from './screens/ScreenMap';
import ScreenNotifications from './screens/ScreenNotifications';

const SCREENS: Record<ScreenKey, ComponentType<ScreenProps>> = {
  splash: ScreenSplash,
  register: ScreenRegister,
  onboard: ScreenOnboard,
  home: ScreenHome,
  arrival: ScreenArrival,
  fuel_setup: ScreenFuelSetup,
  fuel_live: ScreenFuelLive,
  fuel_done: ScreenReceipt,
  ev_map: ScreenEVMap,
  ev_live: ScreenEVLive,
  ev_receipt: ScreenEVReceipt,
  store: ScreenStore,
  store_done: ScreenStoreDone,
  history: ScreenHistory,
  wallet: ScreenWallet,
  profile: ScreenProfile,
  map: ScreenMap,
  notifications: ScreenNotifications,
};

const SCREEN_LABELS: Record<ScreenKey, string> = {
  splash: '01 Splash', register: '02 הרשמה', onboard: '03 Onboarding', home: '04 Home',
  arrival: '05 Arrival | ALPR', fuel_setup: '06 Fuel setup', fuel_live: '07 Fuel live',
  fuel_done: '08 Receipt', ev_map: '09 EV map', ev_live: '10 EV live',
  ev_receipt: '11 EV Receipt', store: '12 Store', store_done: '13 Order track', history: '14 History',
  wallet: '15 Wallet', profile: '16 Profile', map: '17 Map', notifications: '18 Notifications',
};

const HERO_OPTIONS: [HeroVariant, string][] = [
  ['illustration', 'איור | זרוע + רכב'],
  ['photo', 'תצלום (מיקום שמור)'],
  ['livecam', 'מצלמה חיה | HUD'],
];

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('branded');
  const [heroVariant, setHeroVariant] = useState<HeroVariant>('illustration');
  const [screen, setScreen] = useState<ScreenKey>('splash');
  const [state, setState] = useState<AppState>({ amount: 200, evMode: false });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const theme = GSM_THEMES[themeKey];

  // Restore last screen after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gsm:screen') as ScreenKey | null;
      if (saved && saved in SCREENS) setScreen(saved);
    } catch { /* ignore */ }
  }, []);

  const nav = (k: ScreenKey) => {
    setScreen(k);
    try { localStorage.setItem('gsm:screen', k); } catch { /* ignore */ }
  };

  const pageBg = themeKey === 'midnight' ? '#06070B' : themeKey === 'sunset' ? '#EAE4DA' : '#F5D9C4';
  const headerInk = themeKey === 'midnight' ? '#F5F2EC' : '#1A1410';

  const Comp = SCREENS[screen] || ScreenHome;
  const screenProps: ScreenProps = { theme, nav, state, setState, heroVariant };

  return (
    <main style={{
      minHeight: '100vh', width: '100%', background: pageBg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px',
      transition: 'background 0.3s',
    }}>
      {/* header */}
      <div style={{ width: '100%', maxWidth: 1280, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, direction: 'rtl', color: headerInk }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1.5, opacity: 0.6, marginBottom: 4 }}>
            GSM — GAS STATION MANAGEMENT | אפליקציית לקוחות
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.05 }}>
            מהעבר המייגע אל <span style={{ background: theme.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>תחנת העתיד</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, direction: 'ltr' }}>
          <button onClick={() => setTweaksOpen(v => !v)} style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 13, fontWeight: 600, fontFamily: HE_FONT }}>
            {tweaksOpen ? 'סגור הגדרות' : 'הגדרות תצוגה'}
          </button>
          <button onClick={() => nav('home')} style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 13, fontWeight: 600, fontFamily: HE_FONT }}>← למסך הבית</button>
        </div>
      </div>

      {/* screen picker */}
      <div style={{ width: '100%', maxWidth: 1280, marginBottom: 28, direction: 'rtl' }}>
        <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1, opacity: 0.5, marginBottom: 10, color: headerInk }}>מסכים | לחץ כדי לנווט</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(Object.entries(SCREEN_LABELS) as [ScreenKey, string][]).map(([k, l]) => (
            <button key={k} onClick={() => nav(k)} style={{
              padding: '7px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: screen === k ? theme.grad : (themeKey === 'midnight' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
              color: screen === k ? '#fff' : headerInk,
              fontSize: 12, fontWeight: screen === k ? 700 : 500, fontFamily: HE_FONT, direction: 'ltr',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* device */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1.5, opacity: 0.5, color: headerInk }}>Android | 412 × 892</div>
        <AndroidDevice dark={themeKey === 'midnight'}>
          <div key={screen} className="gsm-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Comp {...screenProps} />
          </div>
        </AndroidDevice>
      </div>

      <div style={{ marginTop: 48, maxWidth: 680, textAlign: 'center', direction: 'rtl', color: themeKey === 'midnight' ? '#A8A3A0' : '#6B5E52', fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1, marginBottom: 8, opacity: 0.7 }}>הערות עיצוביות</div>
        כיסוי של כל דרישות פלטפורמת הלקוחות מסיפור המשתמש — זיהוי לוחית רישוי, נעילת סוג דלק, זרוע רובוטית, תשלום מוצפן,
        טעינה חשמלית, ומסירת הזמנות מהחנות לחלון הרכב.
      </div>

      {/* tweaks panel */}
      {tweaksOpen && (
        <div style={{ position: 'fixed', bottom: 20, left: 20, width: 280, zIndex: 100, background: '#fff', borderRadius: 18, padding: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: HE_FONT, direction: 'rtl', color: '#1A1410' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>הגדרות תצוגה</div>
            <button onClick={() => setTweaksOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>×</button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1, color: '#999', marginBottom: 8 }}>נושא צבעים</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(Object.entries(GSM_THEMES) as [ThemeKey, typeof theme][]).map(([k, t]) => (
                <button key={k} onClick={() => setThemeKey(k)} style={{
                  flex: 1, padding: '10px 6px', borderRadius: 10,
                  border: themeKey === k ? `2px solid ${t.accent}` : '1px solid rgba(0,0,0,0.1)',
                  background: t.grad, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: HE_FONT, cursor: 'pointer',
                }}>{t.name}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: MONO_FONT, letterSpacing: 1, color: '#999', marginBottom: 8 }}>חזותי תדלוק</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {HERO_OPTIONS.map(([k, l]) => (
                <button key={k} onClick={() => setHeroVariant(k)} style={{
                  padding: '10px 12px', borderRadius: 10, textAlign: 'right',
                  border: heroVariant === k ? `2px solid ${theme.accent}` : '1px solid rgba(0,0,0,0.1)',
                  background: heroVariant === k ? theme.gradSoft : '#fff',
                  fontSize: 13, fontWeight: heroVariant === k ? 700 : 500, fontFamily: HE_FONT, cursor: 'pointer',
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
