import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle2, User, Activity, TrendingDown } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { motion } from 'framer-motion';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useAuditLog } from '@/hooks/useAuditLog';

const categoryLabels = { pump: 'משאבה', charging_station: 'עמדת טעינה', sensor: 'חיישן', electrical: 'חשמל', plumbing: 'אינסטלציה', payment_terminal: 'מסוף תשלום', other: 'אחר' };
const priorityLabels = { critical: 'קריטי', high: 'גבוה', medium: 'בינוני', low: 'נמוך' };
const priorityColors = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-accent text-accent-foreground',
  medium: 'bg-chart-4/10 text-chart-4 border border-chart-4/20',
  low: 'bg-secondary text-muted-foreground'
};
const categoryIcons = {
  pump: '⛽', charging_station: '⚡', sensor: '📡', electrical: '🔌', plumbing: '🔧', payment_terminal: '💳', other: '🔩'
};

export default function MaintenancePage() {
  const [showDialog, setShowDialog] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('open');
  const queryClient = useQueryClient();
  const { log } = useAuditLog();

  const { data: tickets = [] } = useQuery({ queryKey: ['serviceTickets'], queryFn: () => base44.entities.ServiceTicket.list('-created_date', 200) });

  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category: 'pump', assigned_to: '' });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const ticket = await base44.entities.ServiceTicket.create(data);
      await log({
        action: 'service_ticket_created',
        entity_type: 'ServiceTicket',
        entity_id: ticket.id,
        details: `קריאת שירות חדשה: ${data.title}`,
        new_value: `${priorityLabels[data.priority] || data.priority} • ${categoryLabels[data.category] || data.category}`,
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['serviceTickets'] }); setShowDialog(false); setForm({ title: '', description: '', priority: 'medium', category: 'pump', assigned_to: '' }); }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, ticket }) => {
      await base44.entities.ServiceTicket.update(id, data);
      if (data.status) {
        const statusLabels = { in_progress: 'בטיפול', resolved: 'טופל', closed: 'סגור', open: 'פתוח' };
        await log({
          action: 'service_ticket_updated',
          entity_type: 'ServiceTicket',
          entity_id: id,
          details: `עדכון סטטוס קריאה: ${ticket?.title || ''}`,
          old_value: statusLabels[ticket?.status] || ticket?.status,
          new_value: statusLabels[data.status] || data.status,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['serviceTickets'] })
  });

  const filtered = tickets.filter(t => {
    const priorityMatch = filterPriority === 'all' || t.priority === filterPriority;
    const statusMatch = filterStatus === 'all' 
      ? true 
      : filterStatus === 'open' 
        ? !['resolved', 'closed'].includes(t.status)
        : filterStatus === 'closed'
          ? ['resolved', 'closed'].includes(t.status)
          : t.status === filterStatus;
    return priorityMatch && statusMatch;
  });

  const openCount = tickets.filter(t => !['resolved', 'closed'].includes(t.status)).length;
  const criticalCount = tickets.filter(t => t.priority === 'critical' && !['resolved', 'closed'].includes(t.status)).length;
  const highCount = tickets.filter(t => t.priority === 'high' && !['resolved', 'closed'].includes(t.status)).length;
  const resolvedCount = tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  // By category
  const byCat = Object.entries(
    tickets.filter(t => !['resolved', 'closed'].includes(t.status)).reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">תחזוקה וקריאות שירות</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tickets.length} קריאות סה״כ • {openCount} פתוחות • {resolvedCount} טופלו
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className={cn(criticalCount > 0 && "bg-destructive hover:bg-destructive/90")}>
              <Plus className="w-4 h-4 ml-2" />קריאה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>קריאת שירות חדשה</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
              <div><Label>כותרת</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><Label>תיאור</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>עדיפות</Label>
                  <Select value={form.priority} onValueChange={v => setForm({...form, priority: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(priorityLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>קטגוריה</Label>
                  <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>טכנאי מוקצה</Label><Input value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} /></div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? 'שומר...' : 'פתח קריאה'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'פתוחות', value: openCount, color: openCount > 0 ? 'text-accent' : 'text-primary', bg: openCount > 0 ? 'bg-accent/10' : 'bg-primary/10', filter: 'open' },
          { label: 'קריטיות', value: criticalCount, color: criticalCount > 0 ? 'text-destructive' : 'text-primary', bg: criticalCount > 0 ? 'bg-destructive/10' : 'bg-primary/10', filter: 'critical' },
          { label: 'עדיפות גבוהה', value: highCount, color: 'text-chart-4', bg: 'bg-chart-4/10', filter: 'high' },
          { label: 'בטיפול', value: inProgressCount, color: 'text-chart-3', bg: 'bg-chart-3/10', filter: 'in_progress' },
          { label: 'טופלו', value: resolvedCount, color: 'text-primary', bg: 'bg-primary/10', filter: 'closed' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={cn("p-4 border-border/50 cursor-pointer transition-all hover:shadow-md", filterStatus === kpi.filter && "ring-2 ring-primary/40")}
              onClick={() => setFilterStatus(filterStatus === kpi.filter ? 'all' : kpi.filter)}>
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <Activity className={cn("w-4 h-4", kpi.color)} />
                </div>
                <div>
                  <p className={cn("text-xl font-bold font-inter", kpi.color)}>{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      {byCat.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-3">קריאות פתוחות לפי קטגוריה</p>
            <div className="flex flex-wrap gap-2">
              {byCat.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 text-sm">
                  <span>{categoryIcons[cat] || '🔩'}</span>
                  <span className="font-medium">{categoryLabels[cat] || cat}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary h-5 px-1.5 text-xs">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center">סטטוס:</span>
        {[['all', 'הכל'], ['open', 'פתוחות'], ['in_progress', 'בטיפול'], ['closed', 'סגורות']].map(([v, l]) => (
          <Button key={v} variant={filterStatus === v ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(v)}>{l}</Button>
        ))}
        <span className="text-xs text-muted-foreground self-center mr-4">עדיפות:</span>
        {[['all', 'הכל'], ['critical', 'קריטי'], ['high', 'גבוה'], ['medium', 'בינוני'], ['low', 'נמוך']].map(([v, l]) => (
          <Button key={v} variant={filterPriority === v ? 'default' : 'outline'} size="sm" onClick={() => setFilterPriority(v)}>{l}</Button>
        ))}
      </div>

      {/* Tickets */}
      {filtered.length === 0 ? (
        <EmptyState icon={Wrench} title="אין קריאות שירות" description="הכל תקין!" />
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket, i) => (
            <motion.div key={ticket.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={cn(
                "p-4 border-border/50 hover:shadow-md transition-all",
                ticket.priority === 'critical' && "border-destructive/40 bg-destructive/5",
                ticket.priority === 'high' && "border-accent/30"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base">{categoryIcons[ticket.category] || '🔩'}</span>
                      <h3 className="text-sm font-semibold">{ticket.title}</h3>
                      <Badge className={cn("text-xs", priorityColors[ticket.priority])}>
                        {priorityLabels[ticket.priority] || ticket.priority}
                      </Badge>
                      <StatusBadge status={ticket.status} />
                    </div>
                    {ticket.description && <p className="text-xs text-muted-foreground mb-2">{ticket.description}</p>}
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <span>{categoryIcons[ticket.category]}</span>
                        {categoryLabels[ticket.category] || ticket.category}
                      </span>
                      {ticket.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.assigned_to}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {moment(ticket.created_date).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {ticket.status === 'open' && (
                      <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: ticket.id, data: { status: 'in_progress' }, ticket })} className="text-xs h-7">
                        התחל טיפול
                      </Button>
                    )}
                    {!['resolved', 'closed'].includes(ticket.status) && (
                      <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: ticket.id, data: { status: 'resolved' }, ticket })} className="text-xs h-7 text-primary hover:text-primary">
                        <CheckCircle2 className="w-3 h-3 ml-1" />סגור
                      </Button>
                    )}
                    {['resolved', 'closed'].includes(ticket.status) && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        <CheckCircle2 className="w-3 h-3 ml-1" />טופל
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">מציג {filtered.length} מתוך {tickets.length} קריאות</p>
      )}
    </div>
  );
}