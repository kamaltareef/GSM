import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function RevenueChart({ transactions = [], chargingSessions = [] }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric' });

    const fuelRevenue = transactions
      .filter(t => t.created_date?.startsWith(dayStr) && t.status === 'completed')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0);

    const chargeRevenue = chargingSessions
      .filter(s => s.created_date?.startsWith(dayStr) && s.status === 'completed')
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);

    const txCount = transactions.filter(t => t.created_date?.startsWith(dayStr)).length;

    days.push({ name: dayLabel, דלק: Math.round(fuelRevenue), טעינה: Math.round(chargeRevenue), עסקאות: txCount });
  }

  const totalWeek = days.reduce((sum, d) => sum + d.דלק + d.טעינה, 0);
  const avgDay = days.length > 0 ? totalWeek / days.length : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            הכנסות 7 ימים אחרונים
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              סה״כ: <span className="font-semibold text-foreground">₪{totalWeek.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
            </span>
            <span>|</span>
            <span>ממוצע יומי: <span className="font-semibold text-foreground">₪{avgDay.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span></span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} barGap={3} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₪${v}`} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '10px',
                  fontSize: 12,
                  direction: 'rtl'
                }}
                formatter={(value, name) => [`₪${value.toLocaleString()}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="דלק" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="טעינה" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}