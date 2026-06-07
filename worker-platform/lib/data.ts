export interface OrderItem {
  name: string;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  time: string;
  status: 'pending' | 'preparation' | 'ready' | 'delivered';
  plate: string;
}

export interface Shift {
  date: string;
  day: string;
  start: string;
  end: string;
  station: string;
  duration: string;
}

export interface ServiceCall {
  id: string;
  type: string;
  desc: string;
  location: string;
  tools: string[];
  priority: 'urgent' | 'normal';
  status: 'active' | 'resolved';
}

export interface CallHistory {
  id: string;
  type: string;
  date: string;
  duration: string;
  status: string;
}

export const ORDERS_DATA: Order[] = [
  { id: 'ORD-241', items: [{ name: 'קפה שחור', qty: 1 }, { name: 'קרואסון', qty: 2 }], time: '09:14', status: 'pending', plate: 'ABC-123' },
  { id: 'ORD-240', items: [{ name: 'לאטה', qty: 2 }, { name: 'מאפה שוקולד', qty: 1 }, { name: 'מיץ תפוז', qty: 1 }], time: '09:08', status: 'preparation', plate: 'XYZ-789' },
  { id: 'ORD-239', items: [{ name: 'אספרסו', qty: 1 }], time: '08:55', status: 'ready', plate: 'MNP-456' },
];

export const SHIFTS_DATA: Shift[] = [
  { date: '27.04', day: 'ראשון', start: '07:00', end: '15:00', station: 'תחנה ראשית', duration: '8ש' },
  { date: '28.04', day: 'שני', start: '07:00', end: '15:00', station: 'תחנה ראשית', duration: '8ש' },
  { date: '30.04', day: 'רביעי', start: '15:00', end: '23:00', station: 'תחנה ראשית', duration: '8ש' },
  { date: '02.05', day: 'שישי', start: '07:00', end: '15:00', station: 'תחנה צפון', duration: '8ש' },
  { date: '04.05', day: 'ראשון', start: '15:00', end: '23:00', station: 'תחנה ראשית', duration: '8ש' },
];

export const SERVICE_CALLS: ServiceCall[] = [
  {
    id: 'SC-0041',
    type: 'תקלת מתקן תדלוק',
    desc: 'משאבת דלק #3 אינה מגיבה. לחץ לא תקין מגלה חסימה בצינור',
    location: 'אי תדלוק 3 — צד מזרח',
    tools: ['מפתח ברגים 14/17', 'מד לחץ דיגיטלי', 'ערכת אטמים', 'פנס עבודה'],
    priority: 'urgent',
    status: 'active',
  },
];

export const CALL_HISTORY: CallHistory[] = [
  { id: 'SC-0039', type: 'תקלת מצלמת אבטחה', date: '25.04', duration: "38 דק'", status: 'resolved' },
  { id: 'SC-0037', type: 'תקלת מסוף תשלום', date: '23.04', duration: "22 דק'", status: 'resolved' },
  { id: 'SC-0034', type: 'תקלת מתאם WiFi', date: '21.04', duration: "15 דק'", status: 'resolved' },
];
