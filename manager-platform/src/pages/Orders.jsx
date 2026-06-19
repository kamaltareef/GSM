import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Coffee, Truck, Clock, CheckCircle2, DollarSign, Package, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

const statusFlow = { pending: 'preparing', preparing: 'ready', ready: 'delivered' };
const statusIcons = { pending: Clock, preparing: Coffee, ready: CheckCircle2, delivered: Truck };
const statusNextLabel = { pending: 'התחל הכנה', preparing: 'מוכן', ready: 'נמסר' };

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState('active');
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: orders = [] } = useQuery({
    queryKey: ['convenienceOrders'],
    queryFn: () => base44.entities.ConvenienceOrder.list('-created_date', 200)
  });

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['storeInventory'],
    queryFn: () => base44.entities.StoreInventory.list(),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, order }) => {
      await base44.entities.ConvenienceOrder.update(id, data);
      if (data.status) {
        const statusLabels = { preparing: 'בהכנה', ready: 'מוכן', delivered: 'נמסר', cancelled: 'בוטל' };
        await log({
          action: 'order_status_updated',
          entity_type: 'ConvenienceOrder',
          entity_id: id,
          details: `עדכון סטטוס הזמנה — לקוח: ${order?.customer_name || '—'}`,
          old_value: statusLabels[order?.status] || order?.status,
          new_value: statusLabels[data.status] || data.status,
        });
      }

      // When delivered — deduct inventory and trigger auto-reorder if needed
      if (data.status === 'delivered' && order?.items?.length) {
        for (const item of order.items) {
          const invItem = inventoryItems.find(i =>
            i.product_name.trim().toLowerCase() === item.name?.trim().toLowerCase()
          );
          if (invItem) {
            const newQty = Math.max(0, (invItem.current_quantity || 0) - (item.quantity || 1));
            await base44.entities.StoreInventory.update(invItem.id, { current_quantity: newQty });

            // Auto-reorder if below threshold and enabled
            if (newQty <= (invItem.min_threshold || 5) && invItem.auto_reorder) {
              await base44.entities.PurchaseOrder.create({
                order_type: 'store_products',
                quantity: invItem.reorder_quantity || 20,
                supplier_name: invItem.supplier_name || '',
                station_id: invItem.station_id,
                triggered_by: 'automatic',
                notes: `הזמנה אוטומטית: ${invItem.product_name} — מלאי ירד ל-${newQty}`,
                status: 'pending',
              });
              await base44.entities.AuditLog.create({
                action: 'auto_reorder',
                entity_type: 'StoreInventory',
                entity_id: invItem.id,
                details: `הזמנה אוטומטית למוצר: ${invItem.product_name} לאחר מכירה`,
                new_value: `${invItem.reorder_quantity || 20} יחידות`,
              });
            }
          }
        }
        queryClient.invalidateQueries({ queryKey: ['storeInventory'] });
        queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['convenienceOrders'] })
  });

  const advanceStatus = (order) => {
    const nextStatus = statusFlow[order.status];
    if (nextStatus) updateMutation.mutate({ id: order.id, data: { status: nextStatus }, order });
  };

  const filtered = orders.filter(o => {
    if (filterStatus === 'active') return ['pending', 'preparing', 'ready'].includes(o.status);
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const totalRevenue = orders.filter(o => ['delivered', 'ready'].includes(o.status)).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeRevenue = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = orders.length > 0 ? orders.reduce((s, o) => s + (o.total_amount || 0), 0) / orders.length : 0;

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">הזמנות חנות נוחות</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} הזמנות סה״כ • {pendingCount + preparingCount + readyCount} פעילות
          </p>
        </div>
      </motion.div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">הכנסות</p>
                <p className="text-lg font-bold font-inter">₪{totalRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><Package className="w-4 h-4 text-accent" /></div>
              <div>
                <p className="text-xs text-muted-foreground">בהמתנה לתשלום</p>
                <p className="text-lg font-bold font-inter">₪{activeRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-chart-3/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-chart-3" /></div>
              <div>
                <p className="text-xs text-muted-foreground">ממוצע הזמנה</p>
                <p className="text-lg font-bold font-inter">₪{avgOrderValue.toFixed(0)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'ממתינות', count: pendingCount, icon: Clock, color: 'text-accent', bg: 'bg-accent/10', filter: 'pending' },
          { label: 'בהכנה', count: preparingCount, icon: Coffee, color: 'text-chart-4', bg: 'bg-chart-4/10', filter: 'preparing' },
          { label: 'מוכנות', count: readyCount, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', filter: 'ready' },
          { label: 'נמסרו', count: deliveredCount, icon: Truck, color: 'text-muted-foreground', bg: 'bg-muted/30', filter: 'delivered' },
        ].map(s => (
          <Card key={s.label} className={cn("p-4 border-border/50 cursor-pointer transition-all hover:shadow-md", filterStatus === s.filter && "ring-2 ring-primary/40")}
            onClick={() => setFilterStatus(filterStatus === s.filter ? 'active' : s.filter)}>
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className={cn("text-xl font-bold font-inter", s.color)}>{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[['active', 'פעילות'], ['all', 'הכל'], ['delivered', 'נמסרו'], ['cancelled', 'בוטלו']].map(([v, l]) => (
          <Button key={v} variant={filterStatus === v ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(v)}>{l}</Button>
        ))}
        {filtered.length > 0 && (
          <Badge variant="secondary" className="self-center text-xs">{filtered.length} הזמנות</Badge>
        )}
      </div>

      {/* Orders Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="אין הזמנות" description="הזמנות חדשות יופיעו כאן" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((order, i) => {
              const StatusIcon = statusIcons[order.status] || Clock;
              const itemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all">
                    <div className={cn(
                      "h-1.5",
                      order.status === 'pending' && "bg-accent",
                      order.status === 'preparing' && "bg-chart-4",
                      order.status === 'ready' && "bg-primary",
                      order.status === 'delivered' && "bg-muted-foreground",
                      order.status === 'cancelled' && "bg-destructive"
                    )} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold">{order.customer_name || 'לקוח'}</p>
                          <p className="text-[10px] text-muted-foreground">{order.vehicle_plate} • {moment(order.created_date).format('HH:mm')}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="space-y-1 mb-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.name} <span className="font-medium text-foreground">×{item.quantity}</span></span>
                            <span className="font-inter font-semibold">₪{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-border/30">
                        <div>
                          <p className="font-bold font-inter text-primary text-base">₪{order.total_amount?.toFixed(0) || 0}</p>
                          <p className="text-[10px] text-muted-foreground">{itemsCount} פריטים</p>
                        </div>
                        {statusFlow[order.status] && (
                          <Button size="sm" onClick={() => advanceStatus(order)} className="text-xs h-8">
                            <StatusIcon className="w-3 h-3 ml-1" />
                            {statusNextLabel[order.status]}
                          </Button>
                        )}
                      </div>

                      {order.delivery_type === 'to_vehicle' && (
                        <Badge variant="secondary" className="mt-2 text-[10px] bg-chart-3/10 text-chart-3 w-full justify-center">
                          <Truck className="w-3 h-3 ml-1" /> הגשה לרכב
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}