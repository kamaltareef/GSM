import { type ScreenProps, type ScreenKey, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar } from '../primitives';
import { IconCar, IconReceipt, IconGift, IconBolt, IconShield } from '../Icons';

export default function ScreenNotifications({ theme, nav }: ScreenProps) {
  const notifs: { t: string; title: string; body: string; accent?: boolean; icon: typeof IconCar; go: ScreenKey }[] = [
    { t: 'עכשיו', title: 'זיהינו אותך בתחנה רוטשילד', body: 'לחץ כדי להתחיל תדלוק מהרכב', accent: true, icon: IconCar, go: 'arrival' },
    { t: 'לפני 2 שעות', title: 'קבלה על תדלוק ₪220', body: 'GSM | יפו | 02 | ויזה •••• 4829', icon: IconReceipt, go: 'history' },
    { t: 'אתמול', title: '3 קפה חינם לחשבונך', body: 'מבצע אפריל | GSM+', icon: IconGift, go: 'store' },
    { t: '12.04', title: 'טעינה הושלמה | 92%', body: 'עמדה 2 | נצבר 8 kWh חיסכון', icon: IconBolt, go: 'ev_receipt' },
    { t: '10.04', title: 'עדכון לחוזה המנוי GSM+', body: 'שינויים קלים | לחץ לפרטים', icon: IconShield, go: 'wallet' },
  ];
  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="התראות" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px' }}>
        {notifs.map((n, i) => {
          const I = n.icon;
          return (
            <button key={i} onClick={() => nav(n.go)} style={{
              width: '100%', display: 'flex', gap: 12, padding: '14px 0',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: `1px solid ${theme.line}`, alignItems: 'flex-start',
              background: 'transparent', cursor: 'pointer', direction: 'rtl', fontFamily: HE_FONT, textAlign: 'right',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: n.accent ? theme.grad : theme.ink + '0C', color: n.accent ? '#fff' : theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <I size={18} stroke={n.accent ? '#fff' : undefined} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.ink }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT }}>{n.t}</div>
                </div>
                <div style={{ fontSize: 12, color: theme.ink2, marginTop: 2 }}>{n.body}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
