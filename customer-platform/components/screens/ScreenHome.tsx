import { type ScreenProps, type ScreenKey, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, Card, Section, TabBar, Button } from '../primitives';
import { IconBell, IconFuel, IconBolt, IconCoffee, IconReceipt, IconGift, IconChevronL } from '../Icons';

export default function ScreenHome({ theme, nav, state }: ScreenProps) {
  const vehicle = state.evMode ? 'טסלה מודל 3' : 'טויוטה קורולה';
  return (
    <PhoneScreen theme={theme}>
      <div style={{
        padding: '24px 20px 28px',
        background: `radial-gradient(120% 60% at 80% 0%, ${theme.accent}28 0%, transparent 55%), ${theme.surface}`,
        borderBottom: `1px solid ${theme.line}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: theme.ink2 }}>שלום, שרה</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{vehicle} | 52-847-91</div>
          </div>
          <button onClick={() => nav('notifications')} style={{
            width: 42, height: 42, borderRadius: 14, border: `1px solid ${theme.line}`,
            background: theme.surface, cursor: 'pointer', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
          }}>
            <IconBell size={18} />
            <span style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: theme.accent }} />
          </button>
        </div>

        <Card theme={theme} padded={false} style={{ overflow: 'hidden', border: 'none', background: theme.grad, color: '#fff' }}>
          <div style={{ padding: 20, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: MONO_FONT, opacity: 0.75, letterSpacing: 1 }}>ארנק דלק | GSM+</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6, fontFamily: MONO_FONT, letterSpacing: -1 }}>₪ 248</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>מנוי חודשי | חוסך 12% לליטר</div>
              </div>
              <button onClick={() => nav('wallet')} style={{
                padding: '8px 14px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100, color: '#fff',
                fontSize: 12, fontWeight: 700, fontFamily: HE_FONT, cursor: 'pointer',
              }}>טען</button>
            </div>
          </div>
        </Card>
      </div>

      <Section theme={theme} title="פעולות מהירות">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {([
            { go: 'arrival', icon: IconFuel, color: theme.accent, bg: theme.gradSoft, title: 'סימולציה | הגעה לתחנה', sub: 'תדלוק אוטונומי' },
            { go: 'ev_map', icon: IconBolt, color: theme.ev, bg: `linear-gradient(135deg, ${theme.ev}22, ${theme.ev}11)`, title: 'טעינה חשמלית', sub: 'מצב אלכס | רכב EV' },
            { go: 'store', icon: IconCoffee, color: theme.ink, bg: theme.ink + '0C', title: 'חנות נוחות', sub: 'מסירה לחלון הרכב' },
            { go: 'history', icon: IconReceipt, color: theme.ink, bg: theme.ink + '0C', title: 'היסטוריה', sub: '24 תדלוקים החודש' },
          ] as { go: ScreenKey; icon: typeof IconFuel; color: string; bg: string; title: string; sub: string }[]).map((q) => {
            const Ic = q.icon;
            return (
              <button key={q.go} onClick={() => nav(q.go)} style={{
                padding: 16, borderRadius: 18, background: theme.surface, border: `1px solid ${theme.line}`,
                textAlign: 'right', cursor: 'pointer', fontFamily: HE_FONT, direction: 'rtl',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Ic size={20} stroke={q.color} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.ink }}>{q.title}</div>
                <div style={{ fontSize: 11, color: theme.ink2, marginTop: 2 }}>{q.sub}</div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section theme={theme} title="תחנות בקרבתך" right={<button onClick={() => nav('map')} style={{ background: 'none', border: 'none', fontFamily: HE_FONT, fontSize: 13, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>הכל ←</button>}>
        <Card theme={theme} padded={false} style={{ overflow: 'hidden' }}>
          <div style={{ height: 130, position: 'relative', background: `repeating-linear-gradient(45deg, ${theme.ink}05 0 12px, ${theme.ink}02 12px 24px)` }}>
            <svg width="100%" height="100%" viewBox="0 0 360 130" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0 80 Q100 40, 180 70 T360 50" stroke={theme.ink + '22'} strokeWidth="2" fill="none" />
              <path d="M0 110 L360 90" stroke={theme.ink + '15'} strokeWidth="1" fill="none" />
            </svg>
            <div style={{ position: 'absolute', top: 40, left: '30%', width: 28, height: 28, borderRadius: '50%', background: theme.accent, border: '3px solid #fff', boxShadow: `0 0 0 6px ${theme.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <IconFuel size={12} stroke="#fff" />
            </div>
            <div style={{ position: 'absolute', top: 75, left: '70%', width: 22, height: 22, borderRadius: '50%', background: theme.ev, border: '2px solid #fff' }} />
            <div style={{ position: 'absolute', bottom: 10, right: 12, width: 14, height: 14, borderRadius: '50%', background: '#0080FF', border: '3px solid #fff' }} />
          </div>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>GSM | שדרות רוטשילד</div>
              <div style={{ fontSize: 12, color: theme.ink2, fontFamily: MONO_FONT, marginTop: 2 }}>1.2 ק&quot;מ | 3 משאבות פנויות | 2 עמדות EV</div>
            </div>
            <Button theme={theme} variant="dark" onClick={() => nav('arrival')} style={{ height: 40, borderRadius: 14, padding: '0 14px', fontSize: 13 }}>נווט</Button>
          </div>
        </Card>
      </Section>

      <Section theme={theme} title="הטבות ומבצעים">
        <button onClick={() => nav('store')} style={{ width: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: HE_FONT, direction: 'rtl' }}>
          <Card theme={theme} style={{ display: 'flex', gap: 14, alignItems: 'center', background: theme.gradSoft, border: `1px solid ${theme.accent}30` }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconGift size={22} stroke="#fff" />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>קפה חינם על כל תדלוק</div>
              <div style={{ fontSize: 12, color: theme.ink2 }}>בתוקף עד 30.04 | 3 קפה נוספים</div>
            </div>
            <IconChevronL size={18} stroke={theme.ink2} />
          </Card>
        </button>
      </Section>

      <div style={{ height: 100 }} />
      <TabBar theme={theme} active="home" onNav={nav} />
    </PhoneScreen>
  );
}
