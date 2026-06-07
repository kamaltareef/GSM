import Icon from './Icon';

type Tab = 'home' | 'orders' | 'shifts' | 'profile';

interface BottomNavProps {
  active: Tab;
  onNav: (tab: Tab) => void;
  orderBadge: number;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'בית', icon: 'home' },
  { id: 'orders', label: 'הזמנות', icon: 'orders' },
  { id: 'shifts', label: 'משמרות', icon: 'shifts' },
  { id: 'profile', label: 'פרופיל', icon: 'profile' },
];

export default function BottomNav({ active, onNav, orderBadge }: BottomNavProps) {
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onNav(t.id)}
        >
          <div style={{ position: 'relative' }}>
            <Icon name={t.icon} size={24} color={active === t.id ? '#1A365D' : '#8fa0b0'} />
            {t.id === 'orders' && orderBadge > 0 && (
              <div style={{
                position: 'absolute', top: -4, left: -4, width: 16, height: 16,
                background: '#E53E3E', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{orderBadge}</span>
              </div>
            )}
          </div>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
