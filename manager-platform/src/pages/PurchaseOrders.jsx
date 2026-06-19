import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, CheckCircle2, Clock, Truck, XCircle, Package, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import EmptyState from '../components/shared/EmptyState';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

const fuelLabels = { benzine_95: 'בנזין 95', benzine_98: 'בנזין 98', diesel: 'סולר', autogas: 'גז' };

const statusConfig = {
  pending:   { label: 'ממתין', color: 'bg-secondary text-muted-foreground', icon: Clock },
  approved:  { label: 'אושר', color: 'bg-chart-3/10 text-chart-3', icon: CheckCircle2 },
  ordered:   { label: 'הוזמן', color: 'bg-accent/10 text-accent', icon: ShoppingCart },
  delivered: { label: 'סופק', color: 'bg-primary/10 text-primary', icon: Truck },
  cancelled: { label: 'בוטל', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

const statusFlow = { pending: 'approved', approved: 'ordered', ordered: 'delivered' };

const emptyForm = {
  order_type: 'fuel',
  fuel_type: 'benzine_95',
  quantity: '',
  supplier_name: '',
  estimated_cost: '',
  expected_delivery_date: '',
  notes: '',
  triggered_by: 'manual',
};

export default function PurchaseOrdersPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: () => base44.entities.PurchaseOrder.list('-created_date', 200),
  });
  const { data: tanks = [] } = useQuery({
    queryKey: ['fuelTanks'],
    queryFn: () => base44.entities.FuelTank.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const order = await base44.entities.PurchaseOrder.create(data);
      await base44.entities.AuditLog.create({ action: 'purchase_order', entity_type: 'PurchaseOrder', entity_id: order.id, details: `הזמנת רכש חדשה: ${data.order_type === 'fuel' ? (fuelLabels[data.fuel_type] || 'דלק') : 'מוצרי חנות'}`, new_value: `${data.quantity} יח'` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      setShowDialog(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, order }) => {
      await base44.entities.PurchaseOrder.update(id, data);
      if (data.status) {
        await log({
          action: 'purchase_order_updated',
          entity_type: 'PurchaseOrder',
          entity_id: id,
          details: `עדכון הזמנת רכש — ${order?.order_type === 'fuel' ? (fuelLabels[order?.fuel_type] || 'דלק') : 'מוצרי חנות'}`,
          old_value: statusConfig[order?.status]?.label || order?.status,
          new_value: statusConfig[data.status]?.label || data.status,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });

  // Auto-suggest orders for low tanks
  const lowTanks = tanks.filter(t => (t.current_level_percent || 0) < (t.min_threshold_percent || 15));

  // Active (non-closed) orders per fuel type
  const activeOrdersByFuel = orders.reduce((acc, o) => {
    if (o.order_type === 'fuel' && !['delivered', 'cancelled'].includes(o.status)) {
      acc[o.fuel_type] = true;
    }
    return acc;
  }, {});

  const autoOrderMutation = useMutation({
    mutationFn: async (tank) => {
      const refillAmount = Math.round((tank.capacity_liters || 10000) * 0.85 - (tank.current_level_liters || 0));
      const order = await base44.entities.PurchaseOrder.create({
        order_type: 'fuel',
        fuel_type: tank.fuel_type,
        quantity: refillAmount,
        station_id: tank.station_id,
        triggered_by: 'automatic',
        notes: `הזמנה אוטומטית — מיכל ברמה ${tank.current_level_percent?.toFixed(0)}%`,
        status: 'pending',
      });
      await base44.entities.AuditLog.create({
        action: 'auto_purchase_order',
        entity_type: 'PurchaseOrder',
        entity_id: order.id,
        details: `הזמנה אוטומטית ${fuelLabels[tank.fuel_type]} — רמה ${tank.current_level_percent?.toFixed(0)}%`,
        new_value: `${refillAmount} ליטרים`,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });

  const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const counts = Object.keys(statusConfig).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">הזמנות רכש</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{orders.length} הזמנות סה״כ</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />הזמנה חדשה</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>הזמנת רכש חדשה</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createMutation.mutate({ ...form, quantity: parseFloat(form.quantity), estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : undefined }); }} className="space-y-4">
              <div>
                <Label>סוג הזמנה</Label>
                <Select value={form.order_type} onValueChange={v => setForm({...form, order_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">דלק</SelectItem>
                    <SelectItem value="store_products">מוצרי חנות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.order_type === 'fuel' && (
                <div>
                  <Label>סוג דלק</Label>
                  <Select value={form.fuel_type} onValueChange={v => setForm({...form, fuel_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(fuelLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div><Label>כמות {form.order_type === 'fuel' ? '(ליטרים)' : '(יחידות)'}</Label><Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required /></div>
                <div><Label>עלות משוערת ₪</Label><Input type="number" value={form.estimated_cost} onChange={e => setForm({...form, estimated_cost: e.target.value})} /></div>
              </div>
              <div><Label>שם ספק</Label><Input value={form.supplier_name} onChange={e => setForm({...form, supplier_name: e.target.value})} /></div>
              <div><Label>תאריך אספקה משוער</Label><Input type="date" value={form.expected_delivery_date} onChange={e => setForm({...form, expected_delivery_date: e.target.value})} /></div>
              <div><Label>הערות</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? 'שומר...' : 'צור הזמנה'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Low tank auto-order suggestions */}
      {lowTanks.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">מיכלים בסף נמוך — נדרשת הזמנת דלק</p>
            </div>
            <div className="flex flex-col gap-2">
              {lowTanks.map(tank => {
                const hasActiveOrder = activeOrdersByFuel[tank.fuel_type];
                const refillAmount = Math.round((tank.capacity_liters || 10000) * 0.85 - (tank.current_level_liters || 0));
                return (
                  <div key={tank.id} className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-2 border border-destructive/20">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{fuelLabels[tank.fuel_type]}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-destructive font-bold">{tank.current_level_percent?.toFixed(0)}% מלא</span>
                        <span>•</span>
                        <span>{tank.current_level_liters?.toLocaleString() || 0} / {tank.capacity_liters?.toLocaleString()} ל'</span>
                        <span>•</span>
                        <span>נדרש: ~{refillAmount.toLocaleString()} ל'</span>
                      </div>
                    </div>
                    <div>
                      {hasActiveOrder ? (
                        <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/5">
                          <CheckCircle2 className="w-3 h-3 ml-1" />הזמנה קיימת
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1"
                          disabled={autoOrderMutation.isPending}
                          onClick={() => autoOrderMutation.mutate(tank)}
                        >
                          <Zap className="w-3 h-3" />הזמן אוטומטית
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('all')}>
          הכל ({orders.length})
        </Button>
        {Object.entries(statusConfig).map(([k, v]) => (
          <Button key={k} variant={filterStatus === k ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(k)}>
            {v.label} {counts[k] > 0 && `(${counts[k]})`}
          </Button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">טוען...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="אין הזמנות רכש" description="צור הזמנה חדשה לדלק או מוצרי חנות" />
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            const nextStatus = statusFlow[order.status];
            return (
              <motion.div key={order.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <StatusIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm">
                              {order.order_type === 'fuel' ? (fuelLabels[order.fuel_type] || 'דלק') : 'מוצרי חנות'}
                            </span>
                            <Badge className={cn('text-xs', sc.color)}>{sc.label}</Badge>
                            {order.triggered_by === 'automatic' && (
                              <Badge variant="secondary" className="text-xs">אוטומטי</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>כמות: {order.quantity?.toLocaleString()} {order.order_type === 'fuel' ? 'ל\'' : 'יח\''}  </span>
                            {order.estimated_cost && <span>עלות: ₪{order.estimated_cost?.toLocaleString()}</span>}
                            {order.supplier_name && <span>ספק: {order.supplier_name}</span>}
                            {order.expected_delivery_date && <span>אספקה: {moment(order.expected_delivery_date).format('DD/MM/YY')}</span>}
                          </div>
                          {order.notes && <p className="text-xs text-muted-foreground mt-1">{order.notes}</p>}
                          <p className="text-[11px] text-muted-foreground mt-1">{moment(order.created_date).fromNow()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {nextStatus && (
                          <Button size="sm" variant="outline" className="text-xs h-7"
                            onClick={() => updateMutation.mutate({ id: order.id, data: { status: nextStatus }, order })}>
                            {statusConfig[nextStatus].label} →
                          </Button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive hover:text-destructive"
                            onClick={() => updateMutation.mutate({ id: order.id, data: { status: 'cancelled' }, order })}>
                            בטל
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}