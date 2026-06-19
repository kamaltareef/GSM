import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Fuel, Zap, DollarSign, AlertTriangle, Activity, TrendingUp, Droplets, BarChart3, Building2, ShoppingBag } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TankLevelCard from '../components/dashboard/TankLevelCard';
import ChargingStationCard from '../components/dashboard/ChargingStationCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import RevenueChart from '../components/dashboard/RevenueChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const KpiMini = ({ label, value, unit, color = 'text-primary' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
    <span className={cn('text-lg font-bold font-inter leading-none', color)}>{value}<span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span></span>
  </div>
);

export default function Dashboard() {
  const { data: tanks = [] } = useQuery({ queryKey: ['fuelTanks'], queryFn: () => base44.entities.FuelTank.list() });
  const { data: chargingStations = [] } = useQuery({ queryKey: ['chargingStations'], queryFn: () => base44.entities.ChargingStation.list() });
  const { data: transactions = [] } = useQuery({ queryKey: ['fuelingTransactions'], queryFn: () => base44.entities.FuelingTransaction.list('-created_date', 100) });
  const { data: chargingSessions = [] } = useQuery({ queryKey: ['chargingSessions'], queryFn: () => base44.entities.ChargingSession.list('-created_date', 100) });
  const { data: serviceTickets = [] } = useQuery({ queryKey: ['serviceTickets'], queryFn: () => base44.entities.ServiceTicket.list('-created_date', 50) });
  const { data: stations = [] } = useQuery({ queryKey: ['stations'], queryFn: () => base44.entities.Station.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['convenienceOrders'], queryFn: () => base44.entities.ConvenienceOrder.list('-created_date', 50) });

  const completedTx = transactions.filter(t => t.status === 'completed');
  const completedSessions = chargingSessions.filter(s => s.status === 'completed');

  const totalFuelRevenue = completedTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const totalChargeRevenue = completedSessions.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalOrderRevenue = orders.filter(o => ['delivered', 'ready'].includes(o.status)).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const grandTotal = totalFuelRevenue + totalChargeRevenue + totalOrderRevenue;

  const activeChargers = chargingStations.filter(s => s.status === 'in_use').length;
  const availableChargers = chargingStations.filter(s => s.status === 'available').length;
  const openTickets = serviceTickets.filter(t => !['resolved', 'closed'].includes(t.status)).length;
  const criticalTickets = serviceTickets.filter(t => t.priority === 'critical' && !['resolved', 'closed'].includes(t.status)).length;

  const today = new Date().toISOString().split('T')[0];
  const todayTx = transactions.filter(t => t.created_date?.startsWith(today));
  const todayFuelRevenue = todayTx.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const todayLiters = todayTx.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.liters || 0), 0);

  const totalEnergyDelivered = completedSessions.reduce((sum, s) => sum + (s.energy_delivered_kwh || 0), 0);
  const totalLitersDispensed = completedTx.reduce((sum, t) => sum + (t.liters || 0), 0);

  const avgTxValue = completedTx.length > 0 ? totalFuelRevenue / completedTx.length : 0;
  const lowTanks = tanks.filter(t => (t.current_level_percent || 0) < (t.min_threshold_percent || 15));

  const activeStations = stations.filter(s => s.status === 'active').length;
  const pendingOrders = orders.filter(o => ['pending', 'preparing'].includes(o.status)).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">לוח בקרה</h1>
          <p className="text-sm text-muted-foreground mt-0.5">סקירה כללית של רשת GSM • {stations.length} תחנות פעילות</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs border-primary/30 text-primary">
            <Activity className="w-3 h-3 animate-pulse" />
            מערכת פעילה
          </Badge>
        </div>
      </motion.div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="הכנסות דלק" value={`₪${totalFuelRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`}
          subtitle={`היום: ₪${todayFuelRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`}
          icon={Fuel} colorClass="text-accent" bgClass="bg-accent/10" delay={0}
          trend={`${completedTx.length} עסקאות`} trendUp={true}
        />
        <StatCard title="הכנסות טעינה" value={`₪${totalChargeRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`}
          subtitle={`${activeChargers} עמדות פעילות כעת`}
          icon={Zap} colorClass="text-primary" bgClass="bg-primary/10" delay={0.1}
          trend={`${totalEnergyDelivered.toFixed(0)} kWh`} trendUp={true}
        />
        <StatCard title="סה״כ הכנסות" value={`₪${grandTotal.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`}
          subtitle={`ממוצע עסקה: ₪${avgTxValue.toFixed(0)}`}
          icon={DollarSign} colorClass="text-chart-3" bgClass="bg-chart-3/10" delay={0.2}
          trend={`${completedTx.length + completedSessions.length} עסקאות`} trendUp={true}
        />
        <StatCard title="תקלות פתוחות" value={openTickets}
          subtitle={criticalTickets > 0 ? `${criticalTickets} קריטיות` : 'הכל תקין'}
          icon={AlertTriangle}
          colorClass={openTickets > 0 ? 'text-destructive' : 'text-primary'}
          bgClass={openTickets > 0 ? 'bg-destructive/10' : 'bg-primary/10'} delay={0.3}
        />
      </div>

      {/* Secondary KPI Strip */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/50 bg-secondary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-x divide-x-reverse divide-border/40">
              <KpiMini label="תחנות פעילות" value={activeStations} unit={`מתוך ${stations.length}`} color="text-primary" />
              <KpiMini label="ליטרים היום" value={todayLiters.toFixed(0)} unit="ל'" color="text-accent" />
              <KpiMini label="עמדות טעינה" value={`${availableChargers}/${chargingStations.length}`} unit="פנויות" color="text-primary" />
              <KpiMini label="אנרגיה כוללת" value={totalEnergyDelivered.toFixed(0)} unit="kWh" color="text-chart-3" />
              <KpiMini label="הזמנות פתוחות" value={pendingOrders} unit="הזמנות" color="text-chart-4" />
              <KpiMini label="מיכלים בסף נמוך" value={lowTanks.length} unit="מיכלים" color={lowTanks.length > 0 ? 'text-destructive' : 'text-primary'} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tanks & Chargers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              מיכלי דלק
              <span className="text-xs text-muted-foreground font-normal mr-auto">
                סה״כ: {totalLitersDispensed.toLocaleString()}ל' נמכרו
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tanks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">אין מיכלים מוגדרים</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {tanks.map((tank, i) => <TankLevelCard key={tank.id} tank={tank} index={i} />)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              עמדות טעינה
              <span className="text-xs text-muted-foreground font-normal mr-auto">
                {availableChargers} פנויות | {activeChargers} פעילות מתוך {chargingStations.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chargingStations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">אין עמדות מוגדרות</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chargingStations.slice(0, 6).map((station, i) => (
                  <ChargingStationCard key={station.id} station={station} index={i} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stations Overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              סקירת תחנות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stations.map((station, i) => {
                const stationTanks = tanks.filter(t => t.station_id === station.id);
                const stationChargers = chargingStations.filter(c => c.station_id === station.id);
                const stationRevenue = transactions.filter(t => t.station_id === station.id && t.status === 'completed').reduce((sum, t) => sum + (t.total_amount || 0), 0);
                const stationLowTanks = stationTanks.filter(t => (t.current_level_percent || 0) < 15).length;
                return (
                  <motion.div key={station.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
                    <div className={cn(
                      "p-3 rounded-xl border transition-all hover:shadow-md",
                      station.status === 'active' ? "border-border/50 bg-card" : station.status === 'maintenance' ? "border-accent/30 bg-accent/5" : "border-destructive/30 bg-destructive/5"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold truncate">{station.name}</span>
                        <Badge variant="secondary" className={cn("text-[10px]",
                          station.status === 'active' ? "bg-primary/10 text-primary" :
                          station.status === 'maintenance' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                        )}>
                          {station.status === 'active' ? 'פעיל' : station.status === 'maintenance' ? 'תחזוקה' : 'סגור'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                        <span>🏪 {station.fuel_pumps_count || 0} משאבות</span>
                        <span>⚡ {stationChargers.length} עמדות</span>
                        <span className={cn(stationLowTanks > 0 ? "text-destructive font-medium" : "")}>
                          🛢 {stationLowTanks > 0 ? `${stationLowTanks} בסף נמוך` : `${stationTanks.length} מיכלים`}
                        </span>
                        <span className="text-primary font-medium">₪{stationRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart transactions={transactions} chargingSessions={chargingSessions} />
        </div>
        <div>
          <RecentTransactions transactions={transactions} chargingSessions={chargingSessions} />
        </div>
      </div>
    </div>
  );
}