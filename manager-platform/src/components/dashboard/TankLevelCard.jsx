import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const fuelTypeLabels = {
  benzine_95: 'בנזין 95',
  benzine_98: 'בנזין 98',
  diesel: 'סולר',
  autogas: 'גז'
};

const fuelTypeColors = {
  benzine_95: 'bg-accent',
  benzine_98: 'bg-chart-3',
  diesel: 'bg-chart-4',
  autogas: 'bg-chart-5'
};

const fuelTypeTextColors = {
  benzine_95: 'text-accent',
  benzine_98: 'text-chart-3',
  diesel: 'text-chart-4',
  autogas: 'text-chart-5'
};

export default function TankLevelCard({ tank, index }) {
  const levelPercent = tank.current_level_percent ||
    Math.round((tank.current_level_liters / tank.capacity_liters) * 100) || 0;
  const isLow = levelPercent < (tank.min_threshold_percent || 15);
  const isMedium = levelPercent < 40 && !isLow;
  const estimatedRevenue = (tank.current_level_liters || 0) * (tank.price_per_liter || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        "p-4 border-border/50 transition-all hover:shadow-md",
        isLow && "border-destructive/40 bg-destructive/5"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {isLow && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
            <span className="text-sm font-bold">{fuelTypeLabels[tank.fuel_type] || tank.fuel_type}</span>
          </div>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-bold font-inter",
            isLow ? "bg-destructive/10 text-destructive" :
            isMedium ? "bg-chart-4/10 text-chart-4" :
            "bg-primary/10 text-primary"
          )}>
            {levelPercent}%
          </span>
        </div>

        {/* Tank visualization */}
        <div className="relative h-24 w-full bg-secondary/60 rounded-xl overflow-hidden mb-3 border border-border/30">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${levelPercent}%` }}
            transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
            className={cn(
              "absolute bottom-0 left-0 right-0",
              isLow ? "bg-destructive/40" :
              isMedium ? "bg-chart-4/40" :
              (fuelTypeColors[tank.fuel_type] || "bg-primary") + "/40"
            )}
          />
          {/* Level lines */}
          {[25, 50, 75].map(line => (
            <div key={line} className="absolute left-0 right-0 border-t border-border/20" style={{ bottom: `${line}%` }}>
              <span className="absolute right-1 text-[8px] text-muted-foreground/50 -translate-y-2">{line}%</span>
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-0.5">
            <span className={cn("text-base font-bold font-inter", isLow ? "text-destructive" : fuelTypeTextColors[tank.fuel_type])}>
              {(tank.current_level_liters || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">ליטר</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="bg-secondary/50 rounded-lg p-1.5 text-center">
            <p className="text-muted-foreground">מחיר</p>
            <p className="font-bold font-inter">₪{tank.price_per_liter?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-1.5 text-center">
            <p className="text-muted-foreground">קיבולת</p>
            <p className="font-bold font-inter">{(tank.capacity_liters || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-1.5 text-center">
          <p className="text-[10px] text-muted-foreground">שווי מלאי: <span className="font-semibold text-foreground">₪{estimatedRevenue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span></p>
        </div>

        {isLow && (
          <div className="mt-2 text-[10px] text-destructive font-medium text-center bg-destructive/10 rounded-lg py-1">
            ⚠ דרוש מילוי דחוף
          </div>
        )}
      </Card>
    </motion.div>
  );
}