import StatusBar from '../StatusBar';
import Icon from '../Icon';
import { Order } from '@/lib/data';

interface OrdersScreenProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  onSelect: (order: Order) => void;
  onBack: () => void;
}

const statusLabel: Record<string, string> = { pending: 'ממתין', preparation: 'בהכנה', ready: 'מוכן', delivered: 'נמסר' };
const statusClass: Record<string, string> = { pending: 'badge-orange', preparation: 'badge-blue', ready: 'badge-green', delivered: 'badge-gray' };

export default function OrdersScreen({ orders, setOrders, onSelect, onBack }: OrdersScreenProps) {
  const markReady = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'ready' as const } : o));
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={16} color="#1A365D" /></button>
        <h1>הזמנות פעילות</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0faf4', borderRadius: 20, padding: '4px 10px' }}>
          <div className="live-dot" />
          <span style={{ fontSize: 11, color: '#38A169', fontWeight: 600 }}>חי</span>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map(order => (
            <div key={order.id} className="card slide-up" onClick={() => onSelect(order)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1A365D' }}>{order.id}</span>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>התקבל {order.time}</div>
                </div>
                <span className={`badge ${statusClass[order.status]}`}>{statusLabel[order.status]}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ background: '#f7fafc', borderRadius: 8, padding: '5px 10px', fontSize: 13, color: '#4a5568', fontWeight: 500 }}>
                    {item.name} × {item.qty}
                  </div>
                ))}
              </div>
              {order.status !== 'ready' && order.status !== 'delivered' && (
                <button className="btn-primary" style={{ height: 40, fontSize: 13, background: '#38A169' }}
                  onClick={e => markReady(order.id, e)}>
                  <Icon name="check" size={14} color="#fff" /> סמן כמוכן
                </button>
              )}
              {order.status === 'ready' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38A169', fontSize: 13, fontWeight: 600 }}>
                  <Icon name="check" size={16} color="#38A169" /> מוכן למסירה
                </div>
              )}
              {order.status === 'delivered' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#718096', fontSize: 13, fontWeight: 600 }}>
                  <Icon name="check" size={16} color="#718096" /> נמסר ללקוח
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
