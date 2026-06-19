import { type ScreenProps, HE_FONT, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, TabBar } from '../primitives';
import { IconSearch, IconBolt, IconCar, IconFuel, IconChevronL } from '../Icons';

export default function ScreenHistory({ theme, nav }: ScreenProps) {
  const txs = [
    { date: 'היום | 09:42', station: 'רוטשילד | 04', fuel: '95', amt: 200, L: 28, ev: false, park: false },
    { date: 'אתמול | 18:21', station: 'אבן גבירול | 07', fuel: 'EV | 38 kWh', amt: 32, ev: true, park: false, L: 0 },
    { date: '12.04 | 14:05', station: 'רוטשילד | 04', fuel: '95', amt: 250, L: 35, ev: false, park: false },
    { date: '08.04 | 08:14', station: 'יפו | 02', fuel: '95', amt: 180, L: 25, ev: false, park: false },
    { date: '04.04 | 21:33', station: 'רוטשילד | 04', fuel: 'חניה', amt: 12, ev: false, park: true, L: 0 },
    { date: '01.04 | 10:22', station: 'הרצליה | 11', fuel: '95', amt: 220, L: 31, ev: false, park: false },
  ];
  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="היסטוריה" onBack={() => nav('home')}
        right={<button onClick={() => nav('map')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.ink }}><IconSearch size={18} /></button>} />

      <div style={{ padding: '0 20px 16px' }}>
        <Card theme={theme} padded={false} style={{ overflow: 'hidden', background: theme.grad, color: '#fff', border: 'none' }}>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 11, opacity: 0.8, fontFamily: MONO_FONT, letterSpacing: 1 }}>אפריל 2026</div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: MONO_FONT, marginTop: 4, letterSpacing: -0.8 }}>₪ 1,284</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12 }}>
              <span>24 תדלוקים</span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>186 ליטר | 62 kWh</span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>↓ 12% מהחודש שעבר</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 20px' }}>
        {txs.map((tx, i) => (
          <button key={i} onClick={() => nav(tx.ev ? 'ev_receipt' : 'fuel_done')} style={{
            width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0',
            background: 'transparent', cursor: 'pointer', direction: 'rtl', fontFamily: HE_FONT, textAlign: 'right',
            border: 'none', borderBottom: `1px solid ${theme.line}`,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: tx.ev ? theme.ev + '15' : tx.park ? theme.ink + '0C' : theme.gradSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {tx.ev ? <IconBolt size={20} stroke={theme.ev} /> : tx.park ? <IconCar size={20} /> : <IconFuel size={20} stroke={theme.accent} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.ink }}>{tx.station}</div>
              <div style={{ fontSize: 11, color: theme.ink2, fontFamily: MONO_FONT }}>{tx.date} | {tx.fuel}{tx.L ? ` | ${tx.L}L` : ''}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: MONO_FONT, color: theme.ink }}>₪{tx.amt}</div>
            <IconChevronL size={16} stroke={theme.ink3} />
          </button>
        ))}
      </div>
      <div style={{ height: 100 }} />
      <TabBar theme={theme} active="home" onNav={nav} />
    </PhoneScreen>
  );
}
