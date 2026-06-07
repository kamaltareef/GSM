import StatusBar from '../StatusBar';
import Icon from '../Icon';

interface HomeScreenProps {
  onNav: (screen: string) => void;
  clockedIn: boolean;
  orderCount: number;
  onBell: () => void;
}

export default function HomeScreen({ onNav, clockedIn, orderCount, onBell }: HomeScreenProps) {
  const today = (() => {
    const d = new Date();
    const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    return `היום, ${d.getDate()} ${months[d.getMonth()]}`;
  })();

  const quickActions = [
    { id: 'clockin', icon: 'clock', label: 'שעון נוכחות', bg: '#ebf4ff', badge: 0 },
    { id: 'orders', icon: 'orders', label: 'הזמנות ממתינות', bg: '#ebf8ff', badge: orderCount },
    { id: 'shifts', icon: 'shifts', label: 'המשמרות שלי', bg: '#f0f4f8', badge: 0 },
  ];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div style={{ background: '#1A365D', padding: '16px 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>שלום,</div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginTop: 2 }}>דניאל כהן</div>
          </div>
          <button onClick={onBell} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.12)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bell" size={20} color="#fff" />
            </div>
            {orderCount > 0 && (
              <div style={{ position: 'absolute', top: -3, left: -3, width: 16, height: 16, background: '#E53E3E', borderRadius: '50%', border: '2px solid #1A365D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>{orderCount}</span>
              </div>
            )}
          </button>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', width: 'fit-content' }}>
          <div className="live-dot" style={{ background: clockedIn ? '#68d391' : '#fc8181' }} />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{clockedIn ? 'משמרת פעילה — 07:00 עד 15:00' : 'לא במשמרת'}</span>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 16px 8px', marginTop: -14 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '4px', boxShadow: '0 2px 16px rgba(26,54,93,0.1)', marginBottom: 16 }}>
          {quickActions.map((item, i) => (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < 2 ? '1px solid #f0f4f8' : 'none',
              borderRadius: i === 0 ? '16px 16px 0 0' : i === 2 ? '0 0 16px 16px' : 0,
            }}>
              <div style={{ width: 48, height: 48, background: item.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={item.icon} size={22} color="#1A365D" />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A365D' }}>{item.label}</div>
              </div>
              {item.badge > 0 && (
                <div style={{ background: '#E53E3E', color: '#fff', width: 24, height: 24, borderRadius: '50%', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</div>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(180deg)', flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: 0.5 }}>{today}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ l: 'תחנה', v: 'ראשית' }, { l: 'תפקיד', v: 'עובד חנות' }, { l: 'שעה', v: '07:00–15:00' }].map(({ l, v }) => (
              <div key={l} style={{ flex: 1, background: '#f7fafc', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{l}</div>
                <div style={{ fontSize: 14, color: '#1A365D', fontWeight: 700, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f0faf4', borderRadius: 12, marginBottom: 8 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 13, color: '#38A169', fontWeight: 600 }}>מחובר — עדכונים חיים פעילים</span>
        </div>
      </div>
    </div>
  );
}
