import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings as SettingsIcon, DollarSign, Fuel, Zap, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuditLog } from '@/hooks/useAuditLog';

const fuelLabels = { benzine_95: 'בנזין 95', benzine_98: 'בנזין 98', diesel: 'סולר', autogas: 'גז' };
const chargerLabels = { fast_dc: 'DC מהיר', standard_ac: 'AC רגיל', ultra_fast: 'אולטרה מהיר' };

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { log } = useAuditLog();
  const [showTankDialog, setShowTankDialog] = useState(false);
  const [showChargerDialog, setShowChargerDialog] = useState(false);

  const { data: tanks = [] } = useQuery({ queryKey: ['fuelTanks'], queryFn: () => base44.entities.FuelTank.list() });
  const { data: chargers = [] } = useQuery({ queryKey: ['chargingStations'], queryFn: () => base44.entities.ChargingStation.list() });
  const { data: priceUpdates = [] } = useQuery({ queryKey: ['priceUpdates'], queryFn: () => base44.entities.PriceUpdate.list('-created_date', 20) });

  const [tankForm, setTankForm] = useState({ fuel_type: 'benzine_95', capacity_liters: '', current_level_liters: '', price_per_liter: '', min_threshold_percent: '15' });
  const [chargerForm, setChargerForm] = useState({ charger_type: 'fast_dc', power_kw: '', price_per_kwh: '', charger_number: '' });

  const createTankMutation = useMutation({
    mutationFn: async (data) => {
      const tank = await base44.entities.FuelTank.create(data);
      await log({ action: 'tank_created', entity_type: 'FuelTank', entity_id: tank.id, details: `מיכל דלק חדש: ${fuelLabels[data.fuel_type]}`, new_value: `${data.capacity_liters} ל׳ • ₪${data.price_per_liter}/ל` });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fuelTanks'] }); setShowTankDialog(false); toast.success('מיכל נוסף'); }
  });

  const createChargerMutation = useMutation({
    mutationFn: async (data) => {
      const charger = await base44.entities.ChargingStation.create(data);
      await log({ action: 'charger_created', entity_type: 'ChargingStation', entity_id: charger.id, details: `עמדת טעינה חדשה #${data.charger_number}`, new_value: `${chargerLabels[data.charger_type]} • ${data.power_kw} kW` });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chargingStations'] }); setShowChargerDialog(false); toast.success('עמדה נוספה'); }
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ tanksOfType, newPrice, fuelType }) => {
      const oldPrice = tanksOfType[0]?.price_per_liter;
      await Promise.all(tanksOfType.map(t => base44.entities.FuelTank.update(t.id, { price_per_liter: newPrice })));
      await base44.entities.PriceUpdate.create({ station_id: tanksOfType[0]?.station_id || '', fuel_type: fuelType, old_price: oldPrice, new_price: newPrice, status: 'applied' });
      await log({ action: 'price_update', entity_type: 'FuelTank', entity_id: tanksOfType[0]?.id, details: `עדכון מחיר ${fuelLabels[fuelType] || fuelType}`, old_value: `₪${oldPrice?.toFixed(2)}`, new_value: `₪${newPrice?.toFixed(2)}` });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fuelTanks'] }); queryClient.invalidateQueries({ queryKey: ['priceUpdates'] }); toast.success('מחיר עודכן'); }
  });

  const deleteTankMutation = useMutation({
    mutationFn: async (tank) => {
      await base44.entities.FuelTank.delete(tank.id || tank);
      if (tank.id) await log({ action: 'tank_deleted', entity_type: 'FuelTank', entity_id: tank.id, details: `מיכל דלק נמחק: ${fuelLabels[tank.fuel_type] || ''}`, old_value: `${tank.capacity_liters} ל׳` });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fuelTanks'] }); toast.success('מיכל נמחק'); }
  });

  const deleteChargerMutation = useMutation({
    mutationFn: async (charger) => {
      await base44.entities.ChargingStation.delete(charger.id || charger);
      if (charger.id) await log({ action: 'charger_deleted', entity_type: 'ChargingStation', entity_id: charger.id, details: `עמדת טעינה נמחקה #${charger.charger_number}`, old_value: `${chargerLabels[charger.charger_type]} • ${charger.power_kw} kW` });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chargingStations'] }); toast.success('עמדה נמחקה'); }
  });

  const [editPrices, setEditPrices] = useState({});

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">הגדרות</h1>
        <p className="text-sm text-muted-foreground mt-0.5">ניהול מיכלים, עמדות ותעריפים</p>
      </motion.div>

      <Tabs defaultValue="tanks" dir="rtl">
        <TabsList>
          <TabsTrigger value="tanks" className="gap-1"><Fuel className="w-3 h-3" />מיכלי דלק</TabsTrigger>
          <TabsTrigger value="chargers" className="gap-1"><Zap className="w-3 h-3" />עמדות טעינה</TabsTrigger>
          <TabsTrigger value="prices" className="gap-1"><DollarSign className="w-3 h-3" />תעריפים</TabsTrigger>
        </TabsList>

        <TabsContent value="tanks" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Dialog open={showTankDialog} onOpenChange={setShowTankDialog}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 ml-1" />מיכל חדש</Button></DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader><DialogTitle>מיכל דלק חדש</DialogTitle></DialogHeader>
                <form onSubmit={e => { e.preventDefault(); createTankMutation.mutate({ ...tankForm, capacity_liters: parseFloat(tankForm.capacity_liters), current_level_liters: parseFloat(tankForm.current_level_liters), price_per_liter: parseFloat(tankForm.price_per_liter), min_threshold_percent: parseInt(tankForm.min_threshold_percent), current_level_percent: Math.round((parseFloat(tankForm.current_level_liters) / parseFloat(tankForm.capacity_liters)) * 100) }); }} className="space-y-4">
                  <div>
                    <Label>סוג דלק</Label>
                    <Select value={tankForm.fuel_type} onValueChange={v => setTankForm({...tankForm, fuel_type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(fuelLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>קיבולת (ליטר)</Label><Input type="number" value={tankForm.capacity_liters} onChange={e => setTankForm({...tankForm, capacity_liters: e.target.value})} required /></div>
                    <div><Label>מפלס נוכחי</Label><Input type="number" value={tankForm.current_level_liters} onChange={e => setTankForm({...tankForm, current_level_liters: e.target.value})} required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>מחיר לליטר ₪</Label><Input type="number" step="0.01" value={tankForm.price_per_liter} onChange={e => setTankForm({...tankForm, price_per_liter: e.target.value})} required /></div>
                    <div><Label>סף התראה %</Label><Input type="number" value={tankForm.min_threshold_percent} onChange={e => setTankForm({...tankForm, min_threshold_percent: e.target.value})} /></div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createTankMutation.isPending}>צור מיכל</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {tanks.length === 0 ? (
            <Card className="border-border/50 p-8 text-center text-muted-foreground text-sm">אין מיכלים מוגדרים</Card>
          ) : (
            <div className="space-y-3">
              {tanks.map(tank => (
                <Card key={tank.id} className="p-4 border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Fuel className="w-5 h-5 text-accent" /></div>
                      <div>
                        <p className="font-semibold">{fuelLabels[tank.fuel_type]}</p>
                        <p className="text-xs text-muted-foreground">{tank.current_level_liters?.toLocaleString()} / {tank.capacity_liters?.toLocaleString()} ליטר • ₪{tank.price_per_liter?.toFixed(2)}/ל</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTankMutation.mutate(tank)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chargers" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Dialog open={showChargerDialog} onOpenChange={setShowChargerDialog}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 ml-1" />עמדה חדשה</Button></DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader><DialogTitle>עמדת טעינה חדשה</DialogTitle></DialogHeader>
                <form onSubmit={e => { e.preventDefault(); createChargerMutation.mutate({ ...chargerForm, power_kw: parseFloat(chargerForm.power_kw), price_per_kwh: parseFloat(chargerForm.price_per_kwh), charger_number: parseInt(chargerForm.charger_number) }); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>סוג מטען</Label>
                      <Select value={chargerForm.charger_type} onValueChange={v => setChargerForm({...chargerForm, charger_type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(chargerLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>מספר עמדה</Label><Input type="number" value={chargerForm.charger_number} onChange={e => setChargerForm({...chargerForm, charger_number: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>הספק (kW)</Label><Input type="number" value={chargerForm.power_kw} onChange={e => setChargerForm({...chargerForm, power_kw: e.target.value})} required /></div>
                    <div><Label>מחיר ל-kWh ₪</Label><Input type="number" step="0.01" value={chargerForm.price_per_kwh} onChange={e => setChargerForm({...chargerForm, price_per_kwh: e.target.value})} /></div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createChargerMutation.isPending}>צור עמדה</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {chargers.length === 0 ? (
            <Card className="border-border/50 p-8 text-center text-muted-foreground text-sm">אין עמדות מוגדרות</Card>
          ) : (
            <div className="space-y-3">
              {chargers.map(c => (
                <Card key={c.id} className="p-4 border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-semibold">עמדה #{c.charger_number} • {chargerLabels[c.charger_type]}</p>
                        <p className="text-xs text-muted-foreground">{c.power_kw} kW • ₪{c.price_per_kwh?.toFixed(2)}/kWh</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteChargerMutation.mutate(c)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prices" className="mt-6 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-base">עדכון תעריפי דלק</CardTitle></CardHeader>
            <CardContent>
              {tanks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">הוסף מיכלים תחילה</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    tanks.reduce((acc, tank) => {
                      if (!acc[tank.fuel_type]) acc[tank.fuel_type] = tank;
                      return acc;
                    }, {})
                  ).map(([fuelType, tank]) => (
                    <div key={fuelType} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{fuelLabels[fuelType]}</p>
                        <p className="text-xs text-muted-foreground">מחיר נוכחי: ₪{tank.price_per_liter?.toFixed(2)}</p>
                      </div>
                      <Input 
                        type="number" step="0.01" placeholder="מחיר חדש"
                        value={editPrices[fuelType] || ''} 
                        onChange={e => setEditPrices({...editPrices, [fuelType]: e.target.value})} 
                        className="w-32" 
                      />
                      <Button 
                        size="sm" 
                        disabled={!editPrices[fuelType] || updatePriceMutation.isPending}
                        onClick={() => {
                          const newPrice = parseFloat(editPrices[fuelType]);
                          const tanksOfType = tanks.filter(t => t.fuel_type === fuelType);
                          updatePriceMutation.mutate({ tanksOfType, newPrice, fuelType });
                          setEditPrices({...editPrices, [fuelType]: ''});
                        }}
                      >
                        עדכן
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-base">היסטוריית עדכוני מחירים</CardTitle></CardHeader>
            <CardContent>
              {priceUpdates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">אין עדכונים</p>
              ) : (
                <div className="space-y-2">
                  {priceUpdates.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0">
                      <span>{fuelLabels[p.fuel_type] || p.fuel_type}</span>
                      <span className="text-muted-foreground">₪{p.old_price?.toFixed(2)} → ₪{p.new_price?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}