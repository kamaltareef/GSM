'use client';

import { useState } from 'react';
import StatusBar from '../StatusBar';
import Icon from '../Icon';
import { Order } from '@/lib/data';

interface OrderDetailScreenProps {
  order: Order;
  onBack: () => void;
  onDeliver: (id: string) => void;
}

export default function OrderDetailScreen({ order, onBack, onDeliver }: OrderDetailScreenProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [confirm, setConfirm] = useState(false);
  const allChecked = order.items.every((_, i) => checked[i]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={16} color="#1A365D" /></button>
        <h1>פרטי הזמנה</h1>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{order.id}</span>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 16px 8px' }}>
        <div className="card" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: '#1A365D', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2, letterSpacing: 1 }}>לוחית רישוי</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>{order.plate}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>זוהה אוטומטית</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D', marginTop: 2 }}>רכב לקוח מזוהה</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '12px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>נקלט</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A365D' }}>{order.time}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '12px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>פריטים</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A365D' }}>{order.items.reduce((a, b) => a + b.qty, 0)}</div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A365D', marginBottom: 10 }}>רשימת פריטים</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {order.items.map((item, i) => (
            <button key={i} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))} style={{
              background: checked[i] ? '#f0faf4' : '#fff',
              border: `1.5px solid ${checked[i] ? '#38A169' : '#e2e8f0'}`,
              borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                border: `2px solid ${checked[i] ? '#38A169' : '#cbd5e0'}`,
                background: checked[i] ? '#38A169' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}>
                {checked[i] && <Icon name="check" size={13} color="#fff" />}
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: checked[i] ? '#38A169' : '#1A365D', textDecoration: checked[i] ? 'line-through' : 'none' }}>{item.name}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#94a3b8' }}>× {item.qty}</div>
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ background: allChecked ? '#38A169' : '#cbd5e0', marginBottom: 8, height: 52 }}
          onClick={() => allChecked && setConfirm(true)} disabled={!allChecked}>
          מסירה ללקוח
        </button>
        {!allChecked && <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>סמן את כל הפריטים לפני מסירה</div>}
      </div>

      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(false)}>
          <div className="confirm-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1A365D', marginBottom: 6 }}>אישור מסירה</div>
            <div style={{ fontSize: 14, color: '#718096', marginBottom: 20 }}>האם לסמן את ההזמנה {order.id} כמסורה ללקוח?</div>
            <button className="btn-primary" style={{ background: '#38A169', marginBottom: 10 }} onClick={() => { setConfirm(false); onDeliver(order.id); onBack(); }}>אישור מסירה</button>
            <button className="btn-outline" onClick={() => setConfirm(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
