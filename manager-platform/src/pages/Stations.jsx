import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, MapPin, Fuel, Zap, Store, Users, TrendingUp, Activity } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

export default function StationsPage() {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: stations = [] } = useQuery({ queryKey: ['stations'], queryFn: () => base44.entities.Station.list() });
  const { data: tanks = [] } = useQuery({ queryKey: ['fuelTanks'], queryFn: () => base44.entities.FuelTank.list() });
  const { data: chargingStations = [] } = useQuery({ queryKey: ['chargingStations'], queryFn: () => base44.entities.ChargingStation.list() });
  const { data: transactions = [] } = useQuery({ queryKey: ['fuelingTransactions'], queryFn: () => base44.entities.FuelingTransaction.list('-created_date', 500) });
  const { data: tickets = [] } = useQuery({ queryKey: ['serviceTickets'], queryFn: () => base44.entities.ServiceTicket.list() });

  const [form, setForm] = useState({
    name: '', address: '', city: '', manager_name: '', manager_email: '',
    fuel_pumps_count: '', charging_stations_count: '', has_convenience_store: true
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const station = await base44.entities.Station.create(data);
      await log({
        action: 'station_created',
        entity_type: 'Station',
        entity_id: station.id,
        details: `תחנה חדשה נוצרה: ${data.name}`,
        new_value: `${data.address || ''}${data.city ? ', ' + data.city : ''}`,
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stations'] }); setShowDialog(false); }
  });

  const activeCount = stations.filter(s => s.status === 'active').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;
  const totalPumps = stations.reduce((sum, s) => sum + (s.fuel_pumps_count || 0), 0);
  const totalChargers = stations.reduce((sum, s) => sum + (s.charging_stations_count || 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">תחנות</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stations.length} תחנות • {activeCount} פעילות • {maintenanceCount} בתחזוקה
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 ml-2" />תחנה חדשה</Button></DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>תחנה חדשה</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createMutation.mutate({ ...form, fuel_pumps_count: parseInt(form.fuel_pumps_count) || 0, charging_stations_count: parseInt(form.charging_stations_count) || 0 }); }} className="space-y-4">
              <div><Label>שם תחנה</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>כתובת</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                <div><Label>עיר</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>שם מנהל</Label><Input value={form.manager_name} onChange={e => setForm({...form, manager_name: e.target.value})} /></div>
                <div><Label>אימייל מנהל</Label><Input value={form.manager_email} onChange={e => setForm({...form, manager_email: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>מספר משאבות</Label><Input type="number" value={form.fuel_pumps_count} onChange={e => setForm({...form, fuel_pumps_count: e.target.value})} /></div>
                <div><Label>עמדות טעינה</Label><Input type="number" value={form.charging_stations_count} onChange={e => setForm({...form, charging_stations_count: e.target.value})} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.has_convenience_store} onCheckedChange={v => setForm({...form, has_convenience_store: v})} />
                <Label>חנות נוחות</Label>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? 'שומר...' : 'צור תחנה'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Network Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50 bg-secondary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-x-reverse divide-border/40">
              <div className="text-center"><p className="text-2xl font-bold font-inter text-primary">{stations.length}</p><p className="text-xs text-muted-foreground">תחנות ברשת</p></div>
              <div className="text-center"><p className="text-2xl font-bold font-inter text-accent">{totalPumps}</p><p className="text-xs text-muted-foreground">משאבות דלק</p></div>
              <div className="text-center"><p className="text-2xl font-bold font-inter text-chart-3">{totalChargers}</p><p className="text-xs text-muted-foreground">עמדות טעינה</p></div>
              <div className="text-center"><p className="text-2xl font-bold font-inter text-chart-4">{stations.filter(s => s.has_convenience_store).length}</p><p className="text-xs text-muted-foreground">חנויות נוחות</p></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {stations.length === 0 ? (
        <EmptyState icon={Building2} title="אין תחנות" description="הוסף את התחנה הראשונה שלך" action={<Button onClick={() => setShowDialog(true)}><Plus className="w-4 h-4 ml-2" />הוסף תחנה</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map((station, i) => {
            const stationTanks = tanks.filter(t => t.station_id === station.id);
            const stationChargers = chargingStations.filter(c => c.station_id === station.id);
            const stationTx = transactions.filter(t => t.station_id === station.id && t.status === 'completed');
            const stationRevenue = stationTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
            const stationOpenTickets = tickets.filter(t => t.station_id === station.id && !['resolved', 'closed'].includes(t.status)).length;
            const lowTankCount = stationTanks.filter(t => (t.current_level_percent || 0) < 15).length;
            const availableChargers = stationChargers.filter(c => c.status === 'available').length;
            const inUseChargers = stationChargers.filter(c => c.status === 'in_use').length;

            return (
              <motion.div key={station.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={cn(
                  "border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300",
                  station.status === 'maintenance' && "border-accent/30",
                  station.status === 'closed' && "border-destructive/30"
                )}>
                  <div className={cn(
                    "h-2",
                    station.status === 'active' ? "bg-gradient-to-r from-primary to-primary/60" :
                    station.status === 'maintenance' ? "bg-gradient-to-r from-accent to-accent/60" :
                    "bg-gradient-to-r from-destructive to-destructive/60"
                  )} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                          station.status === 'active' ? "bg-primary/10" : station.status === 'maintenance' ? "bg-accent/10" : "bg-destructive/10"
                        )}>
                          <Building2 className={cn("w-5 h-5", station.status === 'active' ? "text-primary" : station.status === 'maintenance' ? "text-accent" : "text-destructive")} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{station.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{station.address}{station.city ? `, ${station.city}` : ''}</span>
                          </div>
                          {station.manager_name && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Users className="w-3 h-3" />
                              <span>{station.manager_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={station.status} />
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-base font-bold font-inter text-accent">{station.fuel_pumps_count || 0}</p>
                        <p className="text-[10px] text-muted-foreground">משאבות</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-base font-bold font-inter text-primary">{stationChargers.length}</p>
                        <p className="text-[10px] text-muted-foreground">טעינה</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-base font-bold font-inter text-chart-3">{stationTanks.length}</p>
                        <p className="text-[10px] text-muted-foreground">מיכלים</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className={cn("text-base font-bold font-inter", stationOpenTickets > 0 ? "text-destructive" : "text-primary")}>{stationOpenTickets}</p>
                        <p className="text-[10px] text-muted-foreground">תקלות</p>
                      </div>
                    </div>

                    {/* Revenue & Status */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-bold text-primary">₪{stationRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                        <span className="text-xs text-muted-foreground">הכנסות</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {inUseChargers > 0 && (
                          <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">⚡ {inUseChargers} טוענות</Badge>
                        )}
                        {lowTankCount > 0 && (
                          <Badge variant="secondary" className="text-[10px] bg-destructive/10 text-destructive">🛢 {lowTankCount} נמוך</Badge>
                        )}
                        {station.has_convenience_store && (
                          <Badge variant="secondary" className="text-[10px]"><Store className="w-2.5 h-2.5 ml-1" />חנות</Badge>
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