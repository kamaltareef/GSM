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
import { Zap, Plus, BatteryCharging, BatteryFull, BatteryLow, TrendingUp, DollarSign, Activity } from 'lucide-react';
import ChargingStationCard from '../components/dashboard/ChargingStationCard';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { motion } from 'framer-motion';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

const chargerTypeLabels = { fast_dc: 'DC מהיר', standard_ac: 'AC רגיל', ultra_fast: 'Ultra Fast' };
const chargerTypeColors = {
  fast_dc: 'bg-accent/10 text-accent border-accent/20',
  standard_ac: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  ultra_fast: 'bg-primary/10 text-primary border-primary/20'
};

export default function ChargingPage() {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: stations = [] } = useQuery({ queryKey: ['chargingStations'], queryFn: () => base44.entities.ChargingStation.list() });
  const { data: sessions = [] } = useQuery({ queryKey: ['chargingSessions'], queryFn: () => base44.entities.ChargingSession.list('-created_date', 100) });

  const [form, setForm] = useState({
    vehicle_plate: '', customer_name: '', energy_delivered_kwh: '',
    price_per_kwh: '', status: 'completed', charge_percent_start: '', charge_percent_end: ''
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const session = await base44.entities.ChargingSession.create(data);
      await log({
        action: 'charging_session_created',
        entity_type: 'ChargingSession',
        entity_id: session.id,
        details: `סשן טעינה חדש — רכב: ${data.vehicle_plate || '—'}, לקוח: ${data.customer_name || '—'}`,
        new_value: `${data.energy_delivered_kwh} kWh • ₪${(data.total_amount || 0).toFixed(2)}`,
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chargingSessions'] }); setShowDialog(false); }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const energy = parseFloat(form.energy_delivered_kwh);
    const price = parseFloat(form.price_per_kwh);
    createMutation.mutate({
      ...form,
      station_id: stations[0]?.station_id || '',
      charging_station_id: stations[0]?.id || '',
      energy_delivered_kwh: energy,
      price_per_kwh: price,
      total_amount: energy * price,
      charge_percent_start: parseInt(form.charge_percent_start) || 0,
      charge_percent_end: parseInt(form.charge_percent_end) || 100,
    });
  };

  const availableCount = stations.filter(s => s.status === 'available').length;
  const inUseCount = stations.filter(s => s.status === 'in_use').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;
  const offlineCount = stations.filter(s => s.status === 'offline').length;

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalEnergy = completedSessions.reduce((sum, s) => sum + (s.energy_delivered_kwh || 0), 0);
  const totalRevenue = completedSessions.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const avgEnergy = completedSessions.length > 0 ? totalEnergy / completedSessions.length : 0;
  const avgRevenue = completedSessions.length > 0 ? totalRevenue / completedSessions.length : 0;

  const todayEnergy = stations.reduce((sum, s) => sum + (s.energy_delivered_today_kwh || 0), 0);

  // By charger type
  const typeBreakdown = Object.entries(
    stations.reduce((acc, s) => {
      acc[s.charger_type] = acc[s.charger_type] || { count: 0, energy: 0, inUse: 0 };
      acc[s.charger_type].count++;
      acc[s.charger_type].energy += s.energy_delivered_today_kwh || 0;
      if (s.status === 'in_use') acc[s.charger_type].inUse++;
      return acc;
    }, {})
  ).map(([type, data]) => ({ type, ...data }));

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">עמדות טעינה</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stations.length} עמדות • {inUseCount} בשימוש • {availableCount} פנויות
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 ml-2" />סשן חדש</Button></DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>סשן טעינה חדש</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>מספר רכב</Label><Input value={form.vehicle_plate} onChange={e => setForm({...form, vehicle_plate: e.target.value})} /></div>
                <div><Label>שם לקוח</Label><Input value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>אנרגיה (kWh)</Label><Input type="number" step="0.1" value={form.energy_delivered_kwh} onChange={e => setForm({...form, energy_delivered_kwh: e.target.value})} /></div>
                <div><Label>מחיר ל-kWh (₪)</Label><Input type="number" step="0.01" value={form.price_per_kwh} onChange={e => setForm({...form, price_per_kwh: e.target.value})} /></div>
              </div>
              {form.energy_delivered_kwh && form.price_per_kwh && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <span className="text-sm text-muted-foreground">סכום לתשלום: </span>
                  <span className="text-lg font-bold text-primary">₪{(parseFloat(form.energy_delivered_kwh) * parseFloat(form.price_per_kwh)).toFixed(2)}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div><Label>% טעינה - התחלה</Label><Input type="number" value={form.charge_percent_start} onChange={e => setForm({...form, charge_percent_start: e.target.value})} /></div>
                <div><Label>% טעינה - סיום</Label><Input type="number" value={form.charge_percent_end} onChange={e => setForm({...form, charge_percent_end: e.target.value})} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'שומר...' : 'שמור סשן'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'עמדות פנויות', value: availableCount, sub: `מתוך ${stations.length}`, icon: BatteryFull, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'בשימוש כעת', value: inUseCount, sub: `${Math.round(inUseCount / Math.max(stations.length, 1) * 100)}% תפוסה`, icon: BatteryCharging, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'אנרגיה היום', value: `${todayEnergy.toFixed(0)} kWh`, sub: `${completedSessions.length} סשנים`, icon: Zap, color: 'text-chart-3', bg: 'bg-chart-3/10' },
          { label: 'הכנסות טעינה', value: `₪${totalRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`, sub: `ממוצע: ₪${avgRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-chart-4', bg: 'bg-chart-4/10' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.bg)}>
                  <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold font-inter">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Type Breakdown */}
      {typeBreakdown.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">עמדות לפי סוג מטען</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3">
              {typeBreakdown.map(tb => (
                <div key={tb.type} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm", chargerTypeColors[tb.type] || 'bg-secondary text-foreground border-border/40')}>
                  <span className="font-semibold">{chargerTypeLabels[tb.type] || tb.type}</span>
                  <span className="text-xs opacity-75">•</span>
                  <span>{tb.count} עמדות</span>
                  {tb.inUse > 0 && <><span className="text-xs opacity-75">•</span><span className="font-bold">{tb.inUse} פעילות</span></>}
                  <span className="text-xs opacity-75">•</span>
                  <span>{tb.energy.toFixed(0)} kWh היום</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Summary Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'פנויות', count: availableCount, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'בשימוש', count: inUseCount, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
          { label: 'תחזוקה', count: maintenanceCount, color: 'text-chart-4', bg: 'bg-chart-4/10', border: 'border-chart-4/20' },
          { label: 'לא מחובר', count: offlineCount, color: 'text-muted-foreground', bg: 'bg-muted/30', border: 'border-border/40' },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl border p-3 text-center", s.bg, s.border)}>
            <p className={cn("text-2xl font-bold font-inter", s.color)}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stations Grid */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            מצב עמדות בזמן אמת
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stations.length === 0 ? (
            <EmptyState icon={Zap} title="אין עמדות טעינה" description="הוסף עמדות טעינה מדף ההגדרות" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stations.map((s, i) => <ChargingStationCard key={s.id} station={s} index={i} />)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />סשנים אחרונים</span>
            <span className="text-xs font-normal text-muted-foreground">{sessions.length} סשנים סה״כ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">אין סשנים</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="text-right">לוחית</TableHead>
                  <TableHead className="text-right">לקוח</TableHead>
                  <TableHead className="text-right">אנרגיה</TableHead>
                  <TableHead className="text-right">טעינה</TableHead>
                  <TableHead className="text-right">מחיר/kWh</TableHead>
                  <TableHead className="text-right">סכום</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(s => (
                  <TableRow key={s.id} className="hover:bg-secondary/20">
                    <TableCell className="font-mono font-bold text-sm">{s.vehicle_plate || '-'}</TableCell>
                    <TableCell className="text-sm">{s.customer_name || '-'}</TableCell>
                    <TableCell className="font-inter font-medium">{s.energy_delivered_kwh?.toFixed(1)} <span className="text-xs text-muted-foreground">kWh</span></TableCell>
                    <TableCell>
                      {s.charge_percent_start != null && s.charge_percent_end != null ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">{s.charge_percent_start}%</span>
                          <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${s.charge_percent_end}%` }} />
                          </div>
                          <span className="font-medium text-primary">{s.charge_percent_end}%</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="font-inter text-muted-foreground">₪{s.price_per_kwh?.toFixed(2)}</TableCell>
                    <TableCell className="font-inter font-bold text-primary">₪{s.total_amount?.toFixed(0) || 0}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{moment(s.created_date).format('DD/MM HH:mm')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}