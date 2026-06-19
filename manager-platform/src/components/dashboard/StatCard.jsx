import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, colorClass = "text-primary", bgClass = "bg-primary/10", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-5 hover:shadow-lg transition-all duration-300 border-border/50 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
            <p className="text-2xl font-bold font-inter tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && (
              <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trendUp ? "text-primary" : "text-destructive")}>
                <span>{trendUp ? '↑' : '↓'}</span>
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", bgClass)}>
            <Icon className={cn("w-5 h-5", colorClass)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}