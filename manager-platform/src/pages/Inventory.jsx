import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Plus, AlertTriangle, TrendingDown, CheckCircle2, RefreshCw, Pencil } from 'lucide-react';
import EmptyState from '../components/shared/EmptyState';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const categoryLabels = {
  drinks: 'משקאות', food: 'אוכל', snacks: 'חטיפים',
  tobacco: 'טבק', car_accessories: 'אביזרי רכב', other: 'אחר'
};

const emptyForm = {
  product_name: '', category: 'drinks', sku: '',
  current_quantity: '', min_threshold: 5, price: '',
  cost_price: '', supplier_name: '', auto_reorder: true, reorder_quantity: 20
};

export default function InventoryPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLow, setFilterLow] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['storeInventory'],
    queryFn: () => base44.entities.StoreInventory.list('product_name'),
  });

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => base44.entities.Station.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editItem) {
        return base44.entities.StoreInventory.update(editItem.id, data);
      }
      return base44.entities.StoreInventory.create({ ...data, station_id: stations[0]?.id || '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeInventory'] });
      setShowDialog(false);
      setEditItem(null);
      setForm(emptyForm);
    },
  });

  const autoReorderMutation = useMutation({
    mutationFn: async (item) => {
      await base44.entities.PurchaseOrder.create({
        order_type: 'store_products',
        quantity: item.reorder_quantity || 20,
        supplier_name: item.supplier_name || '',
        station_id: item.station_id,
        triggered_by: 'automatic',
        notes: `הזמנה אוטומטית: ${item.product_name} — מלאי נוכחי ${item.current_quantity}`,
        status: 'pending',
      });
      await base44.entities.AuditLog.create({
        action: 'auto_reorder',
        entity_type: 'StoreInventory',
        entity_id: item.id,
        details: `הזמנה אוטומטית למוצר: ${item.product_name}`,
        new_value: `${item.reorder_quantity || 20} יחידות`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast({ title: 'הזמנת רכש אוטומטית נוצרה בהצלחה' });
    },
  });

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setShowDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      current_quantity: parseFloat(form.current_quantity) || 0,
      min_threshold: parseFloat(form.min_threshold) || 5,
      price: parseFloat(form.price) || 0,
      cost_price: parseFloat(form.cost_price) || 0,
      reorder_quantity: parseFloat(form.reorder_quantity) || 20,
    });
  };

  const lowItems = items.filter(i => (i.current_quantity || 0) <= (i.min_threshold || 5));
  const filtered = items.filter(i => {
    const catMatch = filterCategory === 'all' || i.category === filterCategory;
    const lowMatch = !filterLow || (i.current_quantity || 0) <= (i.min_threshold || 5);
    return catMatch && lowMatch;
  });

  const totalValue = items.reduce((sum, i) => sum + ((i.current_quantity || 0) * (i.cost_price || 0)), 0);

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">מלאי חנות נוחות</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} מוצרים • {lowItems.length} בחוסר</p>
        </div>
        <Dialog open={showDialog} onOpenChange={(v) => { setShowDialog(v); if (!v) { setEditItem(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />מוצר חדש</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>שם מוצר</Label><Input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} required /></div>
                <div>
                  <Label>קטגוריה</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>מק"ט</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                <div><Label>כמות במלאי</Label><Input type="number" value={form.current_quantity} onChange={e => setForm({ ...form, current_quantity: e.target.value })} required /></div>
                <div><Label>סף מינימום</Label><Input type="number" value={form.min_threshold} onChange={e => setForm({ ...form, min_threshold: e.target.value })} /></div>
                <div><Label>מחיר מכירה ₪</Label><Input type="number" step="0.1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>מחיר עלות ₪</Label><Input type="number" step="0.1" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} /></div>
                <div><Label>שם ספק</Label><Input value={form.supplier_name} onChange={e => setForm({ ...form, supplier_name: e.target.value })} /></div>
                <div><Label>כמות הזמנה אוטומטית</Label><Input type="number" value={form.reorder_quantity} onChange={e => setForm({ ...form, reorder_quantity: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                <Switch checked={form.auto_reorder} onCheckedChange={v => setForm({ ...form, auto_reorder: v })} />
                <div>
                  <p className="text-sm font-medium">הזמנה אוטומטית</p>
                  <p className="text-xs text-muted-foreground">צור הזמנת רכש אוטומטית כשהמלאי יורד מהסף</p>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'שומר...' : editItem ? 'שמור שינויים' : 'הוסף מוצר'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="w-4 h-4 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">שווי מלאי</p><p className="text-lg font-bold font-inter">₪{totalValue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</p></div>
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">מוצרים תקינים</p><p className="text-lg font-bold font-inter">{items.length - lowItems.length}</p></div>
          </div>
        </Card>
        <Card className={cn("p-4 border-border/50", lowItems.length > 0 && "border-destructive/30 bg-destructive/5")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", lowItems.length > 0 ? "bg-destructive/10" : "bg-secondary")}><AlertTriangle className={cn("w-4 h-4", lowItems.length > 0 ? "text-destructive" : "text-muted-foreground")} /></div>
            <div><p className="text-xs text-muted-foreground">חוסרים / סף נמוך</p><p className={cn("text-lg font-bold font-inter", lowItems.length > 0 && "text-destructive")}>{lowItems.length}</p></div>
          </div>
        </Card>
      </div>

      {/* Low stock alerts */}
      {lowItems.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">התראות מלאי — מוצרים בחוסר</p>
            </div>
            <div className="flex flex-col gap-2">
              {lowItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-2 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <div>
                      <span className="text-sm font-semibold">{item.product_name}</span>
                      <span className="text-xs text-muted-foreground mr-2">
                        נותרו <span className="text-destructive font-bold">{item.current_quantity}</span> / סף: {item.min_threshold}
                      </span>
                    </div>
                  </div>
                  {item.auto_reorder ? (
                    <Button size="sm" className="h-7 text-xs gap-1" disabled={autoReorderMutation.isPending}
                      onClick={() => autoReorderMutation.mutate(item)}>
                      <RefreshCw className="w-3 h-3" />הזמן אוטומטית
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">הזמנה ידנית בלבד</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-36"><SelectValue placeholder="קטגוריה" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הקטגוריות</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={filterLow ? 'default' : 'outline'} size="sm" onClick={() => setFilterLow(!filterLow)}>
          <AlertTriangle className="w-3 h-3 ml-1" />חוסרים בלבד
        </Button>
        <Badge variant="secondary" className="text-xs">{filtered.length} מוצרים</Badge>
      </div>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">טוען מלאי...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="אין מוצרים במלאי" description="הוסף מוצרים לניהול המלאי" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-right">מוצר</TableHead>
                <TableHead className="text-right">קטגוריה</TableHead>
                <TableHead className="text-right">כמות</TableHead>
                <TableHead className="text-right">סף מינימום</TableHead>
                <TableHead className="text-right">מחיר</TableHead>
                <TableHead className="text-right">ספק</TableHead>
                <TableHead className="text-right">הזמנה אוטו'</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const isLow = (item.current_quantity || 0) <= (item.min_threshold || 5);
                return (
                  <TableRow key={item.id} className={cn("hover:bg-secondary/20", isLow && "bg-destructive/5")}>
                    <TableCell className="font-semibold text-sm">{item.product_name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{categoryLabels[item.category] || item.category}</Badge></TableCell>
                    <TableCell className={cn("font-bold font-inter", isLow ? "text-destructive" : "text-foreground")}>{item.current_quantity || 0}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.min_threshold || 5}</TableCell>
                    <TableCell className="font-inter text-sm">₪{item.price?.toFixed(2) || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.supplier_name || '—'}</TableCell>
                    <TableCell>
                      {item.auto_reorder
                        ? <Badge className="bg-primary/10 text-primary text-xs">פעיל</Badge>
                        : <Badge variant="outline" className="text-xs text-muted-foreground">כבוי</Badge>}
                    </TableCell>
                    <TableCell>
                      {isLow
                        ? <Badge className="bg-destructive/10 text-destructive text-xs"><AlertTriangle className="w-3 h-3 ml-1" />חוסר</Badge>
                        : <Badge className="bg-primary/10 text-primary text-xs"><CheckCircle2 className="w-3 h-3 ml-1" />תקין</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}