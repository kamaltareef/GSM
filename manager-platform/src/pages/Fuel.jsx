import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fuel as FuelIcon, Plus, Search, Filter, TrendingUp, Droplets, DollarSign, Hash } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { motion } from 'framer-motion';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

const fuelLabels = { benzine_95: 'בנזין 95', benzine_98: 'בנזין 98', diesel: 'סולר', autogas: 'גז' };
const paymentLabels = { app: 'אפליקציה', cash_terminal: 'מזומן', credit_card: 'אשראי' };
const fuelColors = {
  benzine_95: 'bg-accent/10 text-accent border-accent/20',
  benzine_98: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  diesel: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  autogas: 'bg-chart-5/10 text-chart-5 border-chart-5/20'
};

export default function FuelPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFuel, setFilterFuel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['fuelingTransactions'],
    queryFn: () => base44.entities.FuelingTransaction.list('-created_date', 200)
  });

  const [form, setForm] = useState({
    vehicle_plate: '', customer_name: '', fuel_type: 'benzine_95',
    liters: '', price_per_liter: '', payment_method: 'app',
    pump_number: '', status: 'completed', is_autonomous: true
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const tx = await base44.entities.FuelingTransaction.create(data);
      await log({
        action: 'fueling_transaction_created',
        entity_type: 'FuelingTransaction',
        entity_id: tx.id,
        details: `עסקת תדלוק חדשה — ${fuelLabels[data.fuel_type] || data.fuel_type}, רכב: ${data.vehicle_plate || '—'}`,
        new_value: `${data.liters} ל׳ • ₪${data.total_amount?.toFixed(2)}`,
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fuelingTransactions'] }); setShowDialog(false); }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      liters: parseFloat(form.liters),
      price_per_liter: parseFloat(form.price_per_liter),
      total_amount: parseFloat(form.liters) * parseFloat(form.price_per_liter),
      pump_number: parseInt(form.pump_number) || 1
    });
  };

  const filtered = transactions.filter(t => {
    const statusMatch = filterStatus === 'all' || t.status === filterStatus;
    const fuelMatch = filterFuel === 'all' || t.fuel_type === filterFuel;
    const searchMatch = !searchTerm || t.vehicle_plate?.includes(searchTerm) || t.customer_name?.includes(searchTerm);
    return statusMatch && fuelMatch && searchMatch;
  });

  const completed = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completed.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const totalLiters = completed.reduce((sum, t) => sum + (t.liters || 0), 0);
  const avgLiters = completed.length > 0 ? totalLiters / completed.length : 0;
  const avgValue = completed.length > 0 ? totalRevenue / completed.length : 0;

  // By fuel type
  const fuelBreakdown = Object.entries(
    completed.reduce((acc, t) => {
      acc[t.fuel_type] = acc[t.fuel_type] || { count: 0, liters: 0, revenue: 0 };
      acc[t.fuel_type].count++;
      acc[t.fuel_type].liters += t.liters || 0;
      acc[t.fuel_type].revenue += t.total_amount || 0;
      return acc;
    }, {})
  ).map(([type, data]) => ({ type, ...data }));

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">עסקאות תדלוק</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} עסקאות סה״כ • {completed.length} הושלמו
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />עסקה חדשה</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>עסקת תדלוק חדשה</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>מספר רכב</Label><Input value={form.vehicle_plate} onChange={e => setForm({...form, vehicle_plate: e.target.value})} /></div>
                <div><Label>שם לקוח</Label><Input value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>סוג דלק</Label>
                  <Select value={form.fuel_type} onValueChange={v => setForm({...form, fuel_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(fuelLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>מספר משאבה</Label><Input type="number" value={form.pump_number} onChange={e => setForm({...form, pump_number: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>ליטרים</Label><Input type="number" step="0.1" value={form.liters} onChange={e => setForm({...form, liters: e.target.value})} /></div>
                <div><Label>מחיר לליטר (₪)</Label><Input type="number" step="0.01" value={form.price_per_liter} onChange={e => setForm({...form, price_per_liter: e.target.value})} /></div>
              </div>
              {form.liters && form.price_per_liter && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <span className="text-sm text-muted-foreground">סכום לתשלום: </span>
                  <span className="text-lg font-bold text-primary">₪{(parseFloat(form.liters) * parseFloat(form.price_per_liter)).toFixed(2)}</span>
                </div>
              )}
              <div>
                <Label>אמצעי תשלום</Label>
                <Select value={form.payment_method} onValueChange={v => setForm({...form, payment_method: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(paymentLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'שומר...' : 'שמור עסקה'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">הכנסות כוללות</p>
                <p className="text-xl font-bold font-inter">₪{totalRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Droplets className="w-5 h-5 text-accent" /></div>
              <div>
                <p className="text-xs text-muted-foreground">סה״כ ליטרים</p>
                <p className="text-xl font-bold font-inter">{totalLiters.toLocaleString('he-IL', { maximumFractionDigits: 0 })}<span className="text-sm font-normal text-muted-foreground mr-1">ל'</span></p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-chart-3" /></div>
              <div>
                <p className="text-xs text-muted-foreground">ממוצע עסקה</p>
                <p className="text-xl font-bold font-inter">₪{avgValue.toFixed(0)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center"><Hash className="w-5 h-5 text-chart-4" /></div>
              <div>
                <p className="text-xs text-muted-foreground">עסקאות הושלמו</p>
                <p className="text-xl font-bold font-inter">{completed.length}<span className="text-sm font-normal text-muted-foreground mr-1">/ {transactions.length}</span></p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Fuel Type Breakdown */}
      {fuelBreakdown.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">התפלגות לפי סוג דלק</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3">
                {fuelBreakdown.map(fb => (
                  <div key={fb.type} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm", fuelColors[fb.type] || 'bg-secondary text-foreground border-border/40')}>
                    <span className="font-semibold">{fuelLabels[fb.type] || fb.type}</span>
                    <span className="text-xs opacity-75">•</span>
                    <span>{fb.count} עסקאות</span>
                    <span className="text-xs opacity-75">•</span>
                    <span>{fb.liters.toFixed(0)}ל'</span>
                    <span className="text-xs opacity-75">•</span>
                    <span className="font-bold">₪{fb.revenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <Card className="border-border/50 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="חיפוש לפי לוחית / שם..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><Filter className="w-3 h-3 ml-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="completed">הושלם</SelectItem>
              <SelectItem value="in_progress">בביצוע</SelectItem>
              <SelectItem value="pending">ממתין</SelectItem>
              <SelectItem value="cancelled">בוטל</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterFuel} onValueChange={setFilterFuel}>
            <SelectTrigger className="w-36"><SelectValue placeholder="סוג דלק" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הדלקים</SelectItem>
              {Object.entries(fuelLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          {(filterStatus !== 'all' || filterFuel !== 'all' || searchTerm) && (
            <Badge variant="secondary" className="text-xs">
              {filtered.length} תוצאות
            </Badge>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={FuelIcon} title="אין עסקאות תדלוק" description="עסקאות תדלוק חדשות יופיעו כאן" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-right">לוחית רישוי</TableHead>
                <TableHead className="text-right">לקוח</TableHead>
                <TableHead className="text-right">סוג דלק</TableHead>
                <TableHead className="text-right">משאבה</TableHead>
                <TableHead className="text-right">ליטרים</TableHead>
                <TableHead className="text-right">מחיר/ל'</TableHead>
                <TableHead className="text-right">סכום</TableHead>
                <TableHead className="text-right">תשלום</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id} className="hover:bg-secondary/20">
                  <TableCell className="font-mono text-sm font-bold">{t.vehicle_plate || '-'}</TableCell>
                  <TableCell className="text-sm">{t.customer_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", fuelColors[t.fuel_type])}>{fuelLabels[t.fuel_type] || t.fuel_type}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-inter text-sm">{t.pump_number || '-'}</TableCell>
                  <TableCell className="font-inter font-medium">{t.liters?.toFixed(1)} <span className="text-xs text-muted-foreground">ל'</span></TableCell>
                  <TableCell className="font-inter text-muted-foreground">₪{t.price_per_liter?.toFixed(2)}</TableCell>
                  <TableCell className="font-inter font-bold text-primary">₪{t.total_amount?.toFixed(2)}</TableCell>
                  <TableCell className="text-xs">{paymentLabels[t.payment_method] || t.payment_method}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{moment(t.created_date).format('DD/MM HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Summary Footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>מציג {filtered.length} מתוך {transactions.length} עסקאות</span>
          <span className="font-semibold text-foreground">
            סה״כ מסונן: ₪{filtered.filter(t => t.status === 'completed').reduce((s, t) => s + (t.total_amount || 0), 0).toLocaleString('he-IL', { maximumFractionDigits: 0 })}
          </span>
        </div>
      )}
    </div>
  );
}