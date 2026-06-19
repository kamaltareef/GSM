import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Fuel, Zap, DollarSign, Droplets, FileText, Building2, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const fuelLabels = { benzine_95: 'בנזין 95', benzine_98: 'בנזין 98', diesel: 'סולר', autogas: 'גז' };
const paymentLabels = { app: 'אפליקציה', cash_terminal: 'מזומן', credit_card: 'אשראי' };

const KpiBox = ({ label, value, sub, color = 'text-primary' }) => (
  <div className="text-center p-4 rounded-xl bg-secondary/40 border border-border/30">
    <p className={`text-2xl font-bold font-inter ${color}`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: 12,
    direction: 'rtl'
  }
};

export default function ReportsPage() {
  const { data: transactions = [] } = useQuery({ queryKey: ['fuelingTransactions'], queryFn: () => base44.entities.FuelingTransaction.list('-created_date', 500) });
  const { data: chargingSessions = [] } = useQuery({ queryKey: ['chargingSessions'], queryFn: () => base44.entities.ChargingSession.list('-created_date', 500) });
  const { data: tickets = [] } = useQuery({ queryKey: ['serviceTickets'], queryFn: () => base44.entities.ServiceTicket.list() });

  const completedTx = transactions.filter(t => t.status === 'completed');
  const completedSessions = chargingSessions.filter(s => s.status === 'completed');

  const totalFuelRevenue = completedTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const totalChargeRevenue = completedSessions.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalLiters = completedTx.reduce((sum, t) => sum + (t.liters || 0), 0);
  const totalEnergy = completedSessions.reduce((sum, s) => sum + (s.energy_delivered_kwh || 0), 0);
  const avgFuelTx = completedTx.length > 0 ? totalFuelRevenue / completedTx.length : 0;
  const avgChargeTx = completedSessions.length > 0 ? totalChargeRevenue / completedSessions.length : 0;

  // Fuel distribution
  const fuelDistribution = Object.entries(
    completedTx.reduce((acc, t) => {
      const key = t.fuel_type || 'other';
      acc[key] = (acc[key] || 0) + (t.total_amount || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: fuelLabels[name] || name, value: Math.round(value) }));

  // Liters by fuel type
  const litersByFuel = Object.entries(
    completedTx.reduce((acc, t) => {
      const key = t.fuel_type || 'other';
      acc[key] = (acc[key] || 0) + (t.liters || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: fuelLabels[name] || name, value: Math.round(value) }));

  // Payment method
  const paymentDistribution = Object.entries(
    completedTx.reduce((acc, t) => {
      const key = t.payment_method || 'other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: paymentLabels[name] || name, value }));

  // Daily revenue (last 14 days)
  const dailyRevenue = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    const fuel = completedTx.filter(t => t.created_date?.startsWith(dayStr)).reduce((sum, t) => sum + (t.total_amount || 0), 0);
    const charge = completedSessions.filter(s => s.created_date?.startsWith(dayStr)).reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const txCount = completedTx.filter(t => t.created_date?.startsWith(dayStr)).length;
    dailyRevenue.push({ name: dayLabel, דלק: Math.round(fuel), טעינה: Math.round(charge), סהכ: Math.round(fuel + charge), עסקאות: txCount });
  }

  // Hourly distribution
  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    const fuelCount = completedTx.filter(t => new Date(t.created_date).getHours() === h).length;
    const chargeCount = completedSessions.filter(s => new Date(s.created_date).getHours() === h).length;
    return { name: `${h}:00`, תדלוק: fuelCount, טעינה: chargeCount };
  });

  // Tickets by category
  const ticketsByCategory = Object.entries(
    tickets.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">דוחות וניתוחים</h1>
        <p className="text-sm text-muted-foreground mt-0.5">נתונים סטטיסטיים, מגמות ותובנות עסקיות</p>
      </motion.div>

      {/* Top KPIs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiBox label="הכנסות דלק" value={`₪${totalFuelRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`} sub={`${completedTx.length} עסקאות`} color="text-accent" />
          <KpiBox label="הכנסות טעינה" value={`₪${totalChargeRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`} sub={`${completedSessions.length} סשנים`} color="text-primary" />
          <KpiBox label="ליטרים נמכרו" value={`${totalLiters.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`} sub="ליטרים" color="text-chart-3" />
          <KpiBox label="אנרגיה סופקה" value={`${totalEnergy.toFixed(0)} kWh`} sub={`ממוצע ${avgChargeTx.toFixed(0)} kWh לסשן`} color="text-chart-4" />
        </div>
      </motion.div>

      <Tabs defaultValue="revenue" dir="rtl">
        <TabsList className="mb-2">
          <TabsTrigger value="revenue" className="gap-1"><TrendingUp className="w-3 h-3" />הכנסות</TabsTrigger>
          <TabsTrigger value="distribution" className="gap-1"><PieChartIcon className="w-3 h-3" />התפלגות</TabsTrigger>
          <TabsTrigger value="hourly" className="gap-1"><BarChart3 className="w-3 h-3" />שעתי</TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-1"><Zap className="w-3 h-3" />תחזוקה</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-1"><Receipt className="w-3 h-3" />חשבוניות</TabsTrigger>
          <TabsTrigger value="business" className="gap-1"><Building2 className="w-3 h-3" />לקוחות עסקיים</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                מגמת הכנסות - 14 ימים אחרונים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRevenue}>
                    <defs>
                      <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="chargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip {...tooltipStyle} formatter={v => [`₪${v.toLocaleString()}`, undefined]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="דלק" stroke="hsl(var(--accent))" fill="url(#fuelGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="טעינה" stroke="hsl(var(--primary))" fill="url(#chargeGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="סהכ" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Transactions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                מספר עסקאות יומי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="עסקאות" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Fuel className="w-4 h-4 text-accent" />הכנסות לפי סוג דלק</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fuelDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {fuelDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} formatter={v => [`₪${v.toLocaleString()}`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Droplets className="w-4 h-4 text-chart-3" />ליטרים לפי סוג דלק</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={litersByFuel} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={60} />
                      <Tooltip {...tooltipStyle} formatter={v => [`${v.toLocaleString()} ל'`, undefined]} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {litersByFuel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />אמצעי תשלום</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {paymentDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-chart-4" />ממוצעים עיקריים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'ממוצע עסקת תדלוק', value: `₪${avgFuelTx.toFixed(0)}`, color: 'text-accent', width: Math.min(100, (avgFuelTx / 500) * 100) },
                    { label: 'ממוצע סשן טעינה', value: `₪${avgChargeTx.toFixed(0)}`, color: 'text-primary', width: Math.min(100, (avgChargeTx / 200) * 100) },
                    { label: 'ממוצע ליטרים לעסקה', value: `${(totalLiters / Math.max(completedTx.length, 1)).toFixed(1)} ל'`, color: 'text-chart-3', width: Math.min(100, ((totalLiters / Math.max(completedTx.length, 1)) / 120) * 100) },
                    { label: 'ממוצע kWh לסשן', value: `${(totalEnergy / Math.max(completedSessions.length, 1)).toFixed(1)} kWh`, color: 'text-chart-4', width: Math.min(100, ((totalEnergy / Math.max(completedSessions.length, 1)) / 60) * 100) },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={`font-bold font-inter ${item.color}`}>{item.value}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-current ${item.color}`} style={{ width: `${item.width}%`, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-muted-foreground" />התפלגות עסקאות לפי שעה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip {...tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="תדלוק" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} stackId="a" />
                    <Bar dataKey="טעינה" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">קריאות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ticketsByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {ticketsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">קריאות לפי עדיפות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  {[['critical', 'קריטי', 'text-destructive', 'bg-destructive'],
                    ['high', 'גבוה', 'text-accent', 'bg-accent'],
                    ['medium', 'בינוני', 'text-chart-4', 'bg-chart-4'],
                    ['low', 'נמוך', 'text-muted-foreground', 'bg-muted-foreground']].map(([p, label, textColor, barColor]) => {
                    const count = tickets.filter(t => t.priority === p).length;
                    const pct = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                    return (
                      <div key={p}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={`font-bold font-inter ${textColor}`}>{count} קריאות ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%`, opacity: 0.7 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-accent" />
                היסטוריית חשבוניות עסקאות
                <span className="text-xs font-normal text-muted-foreground mr-auto">{completedTx.length} חשבוניות</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/40 text-xs text-muted-foreground">
                      <th className="text-right p-3 font-medium">מס׳ חשבונית</th>
                      <th className="text-right p-3 font-medium">לקוח</th>
                      <th className="text-right p-3 font-medium">לוחית</th>
                      <th className="text-right p-3 font-medium">סוג דלק</th>
                      <th className="text-right p-3 font-medium">ליטרים</th>
                      <th className="text-right p-3 font-medium">אמצעי תשלום</th>
                      <th className="text-right p-3 font-medium">סכום</th>
                      <th className="text-right p-3 font-medium">תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTx.slice(0, 50).map((tx, i) => (
                      <tr key={tx.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">INV-{String(i + 1001).padStart(5, '0')}</td>
                        <td className="p-3 font-medium">{tx.customer_name || 'אנונימי'}</td>
                        <td className="p-3 font-mono font-bold text-xs">{tx.vehicle_plate || '-'}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">{fuelLabels[tx.fuel_type] || tx.fuel_type}</Badge>
                        </td>
                        <td className="p-3 font-inter">{tx.liters?.toFixed(1)} ל'</td>
                        <td className="p-3 text-xs text-muted-foreground">{paymentLabels[tx.payment_method] || tx.payment_method || '-'}</td>
                        <td className="p-3 font-bold font-inter text-primary">₪{tx.total_amount?.toFixed(0)}</td>
                        <td className="p-3 text-xs text-muted-foreground">{moment(tx.created_date).format('DD/MM/YYYY HH:mm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {completedTx.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground text-sm">אין עסקאות</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Customers Tab */}
        <TabsContent value="business" className="mt-4 space-y-4">
          {(() => {
            // Group transactions by customer email/name to create monthly invoices
            const customerMap = {};
            completedTx.forEach(tx => {
              if (!tx.customer_email && !tx.customer_name) return;
              const key = tx.customer_email || tx.customer_name;
              if (!customerMap[key]) customerMap[key] = { name: tx.customer_name || key, email: tx.customer_email || '', transactions: [] };
              customerMap[key].transactions.push(tx);
            });

            // Filter to "business" customers = more than 2 transactions
            const businessCustomers = Object.values(customerMap).filter(c => c.transactions.length > 2)
              .sort((a, b) => {
                const sumA = a.transactions.reduce((s, t) => s + (t.total_amount || 0), 0);
                const sumB = b.transactions.reduce((s, t) => s + (t.total_amount || 0), 0);
                return sumB - sumA;
              });

            const currentMonth = moment().format('MM/YYYY');

            return (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/40 border border-border/30">
                    <p className="text-2xl font-bold font-inter text-primary">{businessCustomers.length}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">לקוחות עסקיים</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/40 border border-border/30">
                    <p className="text-2xl font-bold font-inter text-accent">
                      ₪{businessCustomers.reduce((s, c) => s + c.transactions.reduce((ss, t) => ss + (t.total_amount || 0), 0), 0).toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">סה״כ הכנסות מלקוחות עסקיים</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/40 border border-border/30">
                    <p className="text-2xl font-bold font-inter text-chart-3">
                      ₪{businessCustomers.length > 0 ? (businessCustomers.reduce((s, c) => s + c.transactions.reduce((ss, t) => ss + (t.total_amount || 0), 0), 0) / businessCustomers.length).toLocaleString('he-IL', { maximumFractionDigits: 0 }) : 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">ממוצע לחשבונית עסקית</p>
                  </div>
                </div>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      חשבוניות חודשיות — {currentMonth}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-secondary/40 text-xs text-muted-foreground">
                            <th className="text-right p-3 font-medium">מס׳ חשבונית</th>
                            <th className="text-right p-3 font-medium">לקוח</th>
                            <th className="text-right p-3 font-medium">אימייל</th>
                            <th className="text-right p-3 font-medium">עסקאות</th>
                            <th className="text-right p-3 font-medium">ליטרים</th>
                            <th className="text-right p-3 font-medium">סה״כ</th>
                            <th className="text-right p-3 font-medium">סטטוס</th>
                          </tr>
                        </thead>
                        <tbody>
                          {businessCustomers.map((customer, i) => {
                            const totalAmount = customer.transactions.reduce((s, t) => s + (t.total_amount || 0), 0);
                            const totalLitersCustomer = customer.transactions.reduce((s, t) => s + (t.liters || 0), 0);
                            const isPaid = i % 3 !== 0; // simulate payment status
                            return (
                              <tr key={customer.email || customer.name} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                                <td className="p-3 font-mono text-xs text-muted-foreground">BIZ-{String(i + 2001).padStart(5, '0')}</td>
                                <td className="p-3 font-semibold">{customer.name}</td>
                                <td className="p-3 text-xs text-muted-foreground">{customer.email || '-'}</td>
                                <td className="p-3 text-center font-inter font-medium">{customer.transactions.length}</td>
                                <td className="p-3 font-inter">{totalLitersCustomer.toFixed(0)} ל'</td>
                                <td className="p-3 font-bold font-inter text-primary">₪{totalAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</td>
                                <td className="p-3">
                                  <Badge variant="secondary" className={`text-[10px] ${isPaid ? 'bg-primary/10 text-primary' : 'bg-chart-4/10 text-chart-4'}`}>
                                    {isPaid ? 'שולם' : 'ממתין לתשלום'}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                          {businessCustomers.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">אין לקוחות עסקיים</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}