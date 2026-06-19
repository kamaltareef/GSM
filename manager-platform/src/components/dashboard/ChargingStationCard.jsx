import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const statusLabels = {
  available: 'פנויה',
  in_use: 'בשימוש',
  reserved: 'שמורה',
  maintenance: 'תחזוקה',
  offline: 'לא פעילה'
};

const statusColors = {
  available: 'bg-primary/10 text-primary border-primary/20',
  in_use: 'bg-accent/10 text-accent border-accent/20',
  reserved: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  maintenance: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  offline: 'bg-muted text-muted-foreground border-border'
};

const typeLabels = {
  fast_dc: 'DC מהיר',
  standard_ac: 'AC רגיל',
  ultra_fast: 'Ultra Fast'
};

const typePowerColors = {
  ultra_fast: 'text-primary',
  fast_dc: 'text-accent',
  standard_ac: 'text-chart-3'
};

export default function ChargingStationCard({ station, index }) {
  const isActive = station.status === 'in_use';
  const revenue = (station.energy_delivered_today_kwh || 0) * (station.price_per_kwh || 1.6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className={cn(
        "p-4 border-border/50 hover:shadow-md transition-all duration-300",
        isActive && "ring-1 ring-accent/40 bg-accent/5",
        station.status === 'offline' && "opacity-70",
        station.status === 'maintenance' && "border-chart-4/30"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center relative",
              isActive ? "bg-accent/15" : station.status === 'available' ? "bg-primary/10" : "bg-muted/50"
            )}>
              <Zap className={cn(
                "w-4 h-4",
                isActive ? "text-accent" : station.status === 'available' ? "text-primary" : "text-muted-foreground"
              )} />
              {isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold">עמדה #{station.charger_number || index + 1}</p>
              <p className={cn("text-[10px] font-medium", typePowerColors[station.charger_type] || 'text-muted-foreground')}>
                {typeLabels[station.charger_type] || station.charger_type}
              </p>
            </div>
          </div>
          <span className={cn("text-[10px] px-2 py-1 rounded-full border font-semibold", statusColors[station.status])}>
            {statusLabels[station.status] || station.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-secondary/60 rounded-lg p-2 text-center">
            <p className="text-muted-foreground text-[10px]">הספק</p>
            <p className="font-bold font-inter">{station.power_kw}<span className="text-[9px] font-normal text-muted-foreground"> kW</span></p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-2 text-center">
            <p className="text-muted-foreground text-[10px]">היום</p>
            <p className="font-bold font-inter">{(station.energy_delivered_today_kwh || 0).toFixed(0)}<span className="text-[9px] font-normal text-muted-foreground"> kWh</span></p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-2 text-center">
            <p className="text-muted-foreground text-[10px]">הכנסה</p>
            <p className="font-bold font-inter text-primary">₪{revenue.toFixed(0)}</p>
          </div>
        </div>

        {station.price_per_kwh && (
          <div className="mt-2 text-[10px] text-muted-foreground text-center">
            ₪{station.price_per_kwh?.toFixed(2)} / kWh
          </div>
        )}
      </Card>
    </motion.div>
  );
}