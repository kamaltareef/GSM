import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fuelTypeLabels = {
  benzine_95: 'בנזין 95',
  benzine_98: 'בנזין 98',
  diesel: 'סולר',
  autogas: 'גז'
};

export default function FuelAlertBanner() {
  const [dismissed, setDismissed] = useState([]);

  const { data: tanks = [] } = useQuery({
    queryKey: ['fuelTanks-alerts'],
    queryFn: () => base44.entities.FuelTank.list(),
    refetchInterval: 60000,
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => base44.entities.StoreInventory.list(),
    refetchInterval: 60000,
  });

  // Fuel alerts: use min_threshold_percent per tank
  const byFuelType = {};
  tanks.forEach(tank => {
    const level = tank.current_level_percent != null
      ? tank.current_level_percent
      : Math.round((tank.current_level_liters / tank.capacity_liters) * 100) || 0;
    const threshold = tank.min_threshold_percent ?? 15;
    if (level < threshold) {
      if (!byFuelType[tank.fuel_type] || level < byFuelType[tank.fuel_type].level) {
        byFuelType[tank.fuel_type] = { key: `fuel-${tank.fuel_type}`, label: fuelTypeLabels[tank.fuel_type] || tank.fuel_type, sublabel: `${level}%`, type: 'fuel' };
      }
    }
  });

  // Inventory alerts: use min_threshold per product
  const lowInventory = inventory
    .filter(item => item.current_quantity <= (item.min_threshold ?? 5))
    .map(item => ({
      key: `inv-${item.id}`,
      label: item.product_name,
      sublabel: `${item.current_quantity} יח׳`,
      type: 'inventory'
    }));

  const allAlerts = [...Object.values(byFuelType), ...lowInventory].filter(a => !dismissed.includes(a.key));

  if (allAlerts.length === 0) return null;

  const fuelAlerts = allAlerts.filter(a => a.type === 'fuel');
  const invAlerts = allAlerts.filter(a => a.type === 'inventory');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-destructive/10 border-b border-destructive/30 px-6 py-2.5 space-y-1.5"
      >
        {fuelAlerts.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm shrink-0">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              מפלס דלק נמוך
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {fuelAlerts.map(a => (
                <span key={a.key} className="inline-flex items-center gap-1.5 bg-destructive/15 text-destructive text-xs font-medium px-2.5 py-1 rounded-full border border-destructive/30">
                  {a.label}
                  <span className="opacity-60">—</span>
                  <span className="font-bold">{a.sublabel}</span>
                  <button onClick={() => setDismissed(d => [...d, a.key])} className="mr-0.5 hover:opacity-70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        )}
        {invAlerts.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm shrink-0">
              <Package className="w-4 h-4 animate-pulse" />
              מלאי חנות נמוך
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {invAlerts.map(a => (
                <span key={a.key} className="inline-flex items-center gap-1.5 bg-destructive/15 text-destructive text-xs font-medium px-2.5 py-1 rounded-full border border-destructive/30">
                  {a.label}
                  <span className="opacity-60">—</span>
                  <span className="font-bold">{a.sublabel}</span>
                  <button onClick={() => setDismissed(d => [...d, a.key])} className="mr-0.5 hover:opacity-70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        )}
        {allAlerts.length > 1 && (
          <button
            onClick={() => setDismissed(d => [...d, ...allAlerts.map(a => a.key)])}
            className="text-xs text-destructive/70 hover:text-destructive underline"
          >
            סגור הכל
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}