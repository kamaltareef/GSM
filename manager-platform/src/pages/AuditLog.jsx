import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import EmptyState from '../components/shared/EmptyState';

const actionColors = {
  price_update: 'bg-accent/10 text-accent border-accent/20',
  employee_created: 'bg-primary/10 text-primary border-primary/20',
  employee_updated: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  employee_deleted: 'bg-destructive/10 text-destructive border-destructive/20',
  station_created: 'bg-primary/10 text-primary border-primary/20',
  station_update: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  tank_created: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  tank_deleted: 'bg-destructive/10 text-destructive border-destructive/20',
  tank_update: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  charger_created: 'bg-primary/10 text-primary border-primary/20',
  charger_deleted: 'bg-destructive/10 text-destructive border-destructive/20',
  purchase_order: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  purchase_order_updated: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  auto_purchase_order: 'bg-accent/10 text-accent border-accent/20',
  auto_reorder: 'bg-accent/10 text-accent border-accent/20',
  fueling_transaction_created: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  charging_session_created: 'bg-primary/10 text-primary border-primary/20',
  order_status_updated: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  service_ticket_created: 'bg-accent/10 text-accent border-accent/20',
  service_ticket_updated: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
};

const actionLabels = {
  price_update: 'עדכון מחיר',
  employee_created: 'עובד נוצר',
  employee_updated: 'עובד עודכן',
  employee_deleted: 'עובד נמחק',
  station_created: 'תחנה נוצרה',
  station_update: 'עדכון תחנה',
  tank_created: 'מיכל נוסף',
  tank_deleted: 'מיכל נמחק',
  tank_update: 'עדכון מיכל',
  charger_created: 'עמדת טעינה נוספה',
  charger_deleted: 'עמדת טעינה נמחקה',
  purchase_order: 'הזמנת רכש',
  purchase_order_updated: 'עדכון הזמנת רכש',
  auto_purchase_order: 'הזמנה אוטומטית',
  auto_reorder: 'הזמנה אוטומטית — מלאי',
  fueling_transaction_created: 'עסקת תדלוק',
  charging_session_created: 'סשן טעינה',
  order_status_updated: 'עדכון הזמנת חנות',
  service_ticket_created: 'קריאת שירות נפתחה',
  service_ticket_updated: 'קריאת שירות עודכנה',
};

const entityLabels = {
  FuelTank: 'מיכל דלק',
  Employee: 'עובד',
  Station: 'תחנה',
  PriceUpdate: 'תעריף',
  PurchaseOrder: 'הזמנת רכש',
  ChargingStation: 'עמדת טעינה',
  ChargingSession: 'סשן טעינה',
  FuelingTransaction: 'עסקת תדלוק',
  ConvenienceOrder: 'הזמנת חנות',
  ServiceTicket: 'קריאת שירות',
  StoreInventory: 'מלאי חנות',
};

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 200),
  });

  const filtered = logs.filter(log => {
    const matchSearch = !search || 
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.performed_by?.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || log.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">יומן ביקורת</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{logs.length} פעולות רשומות במערכת</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="חיפוש..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="כל הפעולות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הפעולות</SelectItem>
            {Object.entries(actionLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log Entries */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 text-sm">טוען...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Shield} title="אין רשומות ביקורת" description="פעולות רגישות יירשמו כאן אוטומטית" />
      ) : (
        <div className="space-y-2">
          {filtered.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="border-border/50 hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`text-xs border ${actionColors[log.action] || 'bg-secondary text-muted-foreground'}`}>
                          {actionLabels[log.action] || log.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entityLabels[log.entity_type] || log.entity_type}
                        </span>
                        {log.details && (
                          <span className="text-sm font-medium truncate">{log.details}</span>
                        )}
                      </div>
                      {(log.old_value || log.new_value) && (
                        <p className="text-xs text-muted-foreground">
                          {log.old_value && <span className="line-through ml-2">{log.old_value}</span>}
                          {log.new_value && <span className="text-primary font-medium">→ {log.new_value}</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {log.performed_by && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />{log.performed_by}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{moment(log.created_date).format('DD/MM/YY HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}