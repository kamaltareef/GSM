import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Button } from '../primitives';
import { IconCoffee, IconHome } from '../Icons';

export default function ScreenStoreDone({ theme, nav }: ScreenProps) {
  const timeline = [
    { t: '12:41', l: 'הזמנה התקבלה', done: true, active: false, pending: false },
    { t: '12:42', l: 'מועברת לקופה | חנות', done: true, active: false, pending: false },
    { t: '12:44', l: 'בהכנה', done: false, active: true, pending: false },
    { t: '12:46', l: 'במסירה לרכב', done: false, active: false, pending: true },
    { t: '12:47', l: 'נמסרה', done: false, active: false, pending: true },
  ];
  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="מעקב הזמנה" onBack={() => nav('home')} />
      <div style={{ padding: '0 20px' }}>
        <Card theme={theme} style={{ marginBottom: 16, padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, margin: '0 auto 16px', borderRadius: '50%', background: theme.gradSoft, border: `2px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <IconCoffee size={44} stroke={theme.accent} />
            <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `2px solid ${theme.accent}`, opacity: 0.3, animation: 'gsm-pulse 2s infinite' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>מכינים את ההזמנה</div>
          <div style={{ fontSize: 13, color: theme.ink2, marginTop: 4 }}>הזמנה #84293 | עובד חנות נוחות דני</div>
          <div style={{ fontSize: 11, color: theme.ink2, marginTop: 12, fontFamily: MONO_FONT, letterSpacing: 1 }}>נמסר לחלון הרכב | חלון זמן משוער 4 דק׳</div>
        </Card>

        <Card theme={theme} style={{ padding: 0 }}>
          {timeline.map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: theme.ink3, fontFamily: MONO_FONT, width: 40 }}>{s.t}</div>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: s.done ? theme.success : s.active ? theme.accent : theme.ink + '15',
                boxShadow: s.active ? `0 0 0 4px ${theme.accent}33` : 'none',
                animation: s.active ? 'gsm-pulse 1.4s infinite' : 'none',
              }} />
              <div style={{ flex: 1, fontSize: 14, fontWeight: s.active ? 700 : 500, color: s.pending ? theme.ink3 : theme.ink }}>{s.l}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button theme={theme} variant="ghost" style={{ flex: 1 }} onClick={() => nav('history')}>לקבלה</Button>
          <Button theme={theme} style={{ flex: 1 }} onClick={() => nav('home')} icon={<IconHome size={16} stroke="#fff" />}>למסך הבית</Button>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </PhoneScreen>
  );
}
