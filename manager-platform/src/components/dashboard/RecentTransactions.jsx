import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import moment from 'moment';

const statusLabels = {
  pending: 'ממתין',
  in_progress: 'בביצוע',
  completed: 'הושלם',
  cancelled: 'בוטל',
  failed: 'נכשל'
};

const statusStyles = {
  pending: 'bg-chart-4/10 text-chart-4',
  in_progress: 'bg-accent/10 text-accent',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/10 text-destructive'
};

const fuelLabels = {
  benzine_95: '95',
  benzine_98: '98',
  diesel: 'סולר',
  autogas: 'גז'
};

export default function RecentTransactions({ transactions = [], chargingSessions = [] }) {
  // Combine and sort by date
  const allItems = [
    ...transactions.map(t => ({ ...t, itemType: 'fuel' })),
    ...chargingSessions.map(s => ({ ...s, itemType: 'charging' }))
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 8);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          פעילות אחרונה
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>אין פעילות עדיין</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allItems.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  item.itemType === 'fuel' ? "bg-accent/10" : "bg-primary/10"
                )}>
                  {item.itemType === 'fuel' 
                    ? <Fuel className="w-4 h-4 text-accent" /> 
                    : <Zap className="w-4 h-4 text-primary" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {item.vehicle_plate || 'לא ידוע'}
                    </span>
                    {item.itemType === 'fuel' && (
                      <span className="text-[10px] text-muted-foreground">
                        {fuelLabels[item.fuel_type]} • {item.liters?.toFixed(1)}ל
                      </span>
                    )}
                    {item.itemType === 'charging' && (
                      <span className="text-[10px] text-muted-foreground">
                        {item.energy_delivered_kwh?.toFixed(1)} kWh
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {item.customer_name || 'לקוח'} • {moment(item.created_date).fromNow()}
                  </p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-sm font-bold font-inter">₪{item.total_amount?.toFixed(0) || 0}</p>
                  <Badge variant="secondary" className={cn("text-[10px] h-5", statusStyles[item.status])}>
                    {statusLabels[item.status] || item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}