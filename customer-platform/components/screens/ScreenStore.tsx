'use client';

import { useState } from 'react';
import { type ScreenProps, MONO_FONT } from '@/lib/theme';
import { PhoneScreen, TopBar, Card, Pill, Button } from '../primitives';
import { IconCar, IconBolt, IconCheck, IconPlus } from '../Icons';
import { createOrder } from '@/lib/db';

const ItemThumb = ({ theme }: { theme: ScreenProps['theme'] }) => (
  <div style={{
    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
    background: `repeating-linear-gradient(45deg, ${theme.ink}08 0 8px, ${theme.ink}04 8px 16px)`,
    border: `1px dashed ${theme.line}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: MONO_FONT, fontSize: 10, color: theme.ink3,
  }}>ITEM</div>
);

export default function ScreenStore({ theme, nav }: ScreenProps) {
  const [cart, setCart] = useState<string[]>(['cap']);
  const items = [
    { k: 'cap', name: 'קפוצ׳ינו גדול', desc: 'פולי תחנות | חלב מלא', price: 12 },
    { k: 'croi', name: 'קרואסון חמאה', desc: 'אפוי היום | חם', price: 10 },
    { k: 'water', name: 'מים 750ml', desc: 'מינרלים | קר', price: 8 },
    { k: 'sand', name: 'סנדוויץ׳ טונה', desc: 'לחם כוסמין', price: 28 },
    { k: 'chips', name: 'תפו״ש אפוי', desc: 'חטיף | 50g', price: 6 },
  ];
  const total = items.filter(i => cart.includes(i.k)).reduce((s, i) => s + i.price, 0);

  return (
    <PhoneScreen theme={theme}>
      <TopBar theme={theme} title="חנות נוחות" onBack={() => nav('home')}
        right={<Pill theme={theme} variant="outline"><IconCar size={12} /> מסירה לרכב</Pill>} />
      <div style={{ padding: '0 20px 20px' }}>
        <Card theme={theme} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, background: theme.ev + '10', border: `1px solid ${theme.ev}30` }}>
          <IconBolt size={18} stroke={theme.ev} />
          <div style={{ flex: 1, fontSize: 13 }}>
            <div style={{ fontWeight: 700 }}>טעינה ברקע | עמדה 3</div>
            <div style={{ color: theme.ink2, fontSize: 11 }}>המסירה ברגע שתהיה מוכנה</div>
          </div>
          <div style={{ fontSize: 11, fontFamily: MONO_FONT, color: theme.ev, fontWeight: 700 }}>12:42</div>
        </Card>

        {items.map(it => {
          const inCart = cart.includes(it.k);
          return (
            <Card key={it.k} theme={theme} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10, background: inCart ? theme.surfaceAlt : theme.surface }}>
              <ItemThumb theme={theme} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{it.name}</div>
                <div style={{ fontSize: 11, color: theme.ink2 }}>{it.desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: MONO_FONT, marginTop: 4 }}>₪{it.price}</div>
              </div>
              <button onClick={() => setCart(c => (c.includes(it.k) ? c.filter(k => k !== it.k) : [...c, it.k]))} style={{
                width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: inCart ? theme.grad : theme.ink + '0C', color: inCart ? '#fff' : theme.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{inCart ? <IconCheck size={16} stroke="#fff" sw={3} /> : <IconPlus size={16} />}</button>
            </Card>
          );
        })}
      </div>
      <div style={{ position: 'sticky', bottom: 0, padding: 20, background: `linear-gradient(180deg, transparent, ${theme.bg} 40%)` }}>
        <Button theme={theme} full disabled={cart.length === 0} onClick={async () => {
          const orderItems = items.filter(i => cart.includes(i.k)).map(i => ({ name: i.name, qty: 1 }));
          // Writes to the shared Firestore `orders` collection (no-op if Firebase isn't configured).
          try { await createOrder({ items: orderItems, total, plate: '52-847-91', station: 'GSM רוטשילד 04' }); } catch { /* offline fallback */ }
          nav('store_done');
        }} icon={<IconCheck size={16} stroke="#fff" sw={3} />}>
          אשר הזמנה | ₪{total} | {cart.length} פריטים
        </Button>
      </div>
    </PhoneScreen>
  );
}
