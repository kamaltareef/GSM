import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import moment from 'moment';
import WeeklyCalendar from './WeeklyCalendar';

const shiftTypeConfig = {
  morning:   { label: 'בוקר',   hours: '06:00–14:00', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  afternoon: { label: 'צהריים', hours: '14:00–22:00', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  night:     { label: 'לילה',   hours: '22:00–06:00', cls: 'bg-purple-100 text-purple-800 border-purple-200' }
};
const statusConfig = {
  scheduled:   { label: 'מתוכנן',     cls: 'bg-primary/10 text-primary' },
  in_progress: { label: 'בביצוע',     cls: 'bg-accent/10 text-accent' },
  completed:   { label: 'הושלם',      cls: 'bg-primary/10 text-primary' },
  absent:      { label: 'לא הגיע',    cls: 'bg-destructive/10 text-destructive' }
};

const EMPTY_FORM = { employee_id: '', date: '', shift_type: 'morning', status: 'scheduled', notes: '' };

// Generate current week days
function getWeekDays(weekOffset = 0) {
  const start = moment().startOf('isoWeek').add(weekOffset, 'weeks');
  return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'days'));
}

export default function ShiftScheduler() {
  const qc = useQueryClient();
  const [weekOffset, setWeekOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => base44.entities.Employee.list() });
  const { data: shifts = [] } = useQuery({ queryKey: ['shifts'], queryFn: () => base44.entities.Shift.list('-date', 200) });

  const addShift = useMutation({
    mutationFn: (data) => {
      const emp = employees.find(e => e.id === data.employee_id);
      return base44.entities.Shift.create({ ...data, employee_name: emp?.full_name || '' });
    },
    onSuccess: () => { qc.invalidateQueries(['shifts']); setOpen(false); }
  });

  const removeShift = useMutation({
    mutationFn: (id) => base44.entities.Shift.delete(id),
    onSuccess: () => qc.invalidateQueries(['shifts'])
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Shift.update(id, { status }),
    onSuccess: () => qc.invalidateQueries(['shifts'])
  });

  const weekDays = getWeekDays(weekOffset);
  const weekLabel = `${weekDays[0].format('DD/MM')} – ${weekDays[6].format('DD/MM/YYYY')}`;

  return (
    <>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[160px] text-center">{weekLabel}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setWeekOffset(0)}>היום</Button>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setForm(EMPTY_FORM); setOpen(true); }}>
          <CalendarPlus className="w-4 h-4" />הוסף משמרת
        </Button>
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendar shifts={shifts.filter(s => weekDays.some(d => d.format('YYYY-MM-DD') === s.date))} weekOffset={weekOffset} onRemove={(id) => removeShift.mutate(id)} />

      {/* Shift List */}
      <Card className="border-border/50 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">כל המשמרות השבוע</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/40 text-xs text-muted-foreground">
                  <th className="text-right p-3 font-medium">עובד</th>
                  <th className="text-right p-3 font-medium">תאריך</th>
                  <th className="text-right p-3 font-medium">משמרת</th>
                  <th className="text-right p-3 font-medium">שעות</th>
                  <th className="text-right p-3 font-medium">סטטוס</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {shifts
                  .filter(s => weekDays.some(d => d.format('YYYY-MM-DD') === s.date))
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map(shift => (
                    <tr key={shift.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 font-medium">{shift.employee_name || '—'}</td>
                      <td className="p-3 text-sm text-muted-foreground">{moment(shift.date).format('DD/MM/YYYY')}</td>
                      <td className="p-3">
                        <Badge className={`text-[10px] border ${shiftTypeConfig[shift.shift_type]?.cls}`}>
                          {shiftTypeConfig[shift.shift_type]?.label}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-inter">{shiftTypeConfig[shift.shift_type]?.hours}</td>
                      <td className="p-3">
                        <Select value={shift.status} onValueChange={v => updateStatus.mutate({ id: shift.id, status: v })}>
                          <SelectTrigger className="h-7 text-xs w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeShift.mutate(shift.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                {shifts.filter(s => weekDays.some(d => d.format('YYYY-MM-DD') === s.date)).length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">אין משמרות לשבוע זה</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle>הוספת משמרת</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Select value={form.employee_id} onValueChange={v => setForm(f => ({ ...f, employee_id: v }))}>
              <SelectTrigger><SelectValue placeholder="בחר עובד *" /></SelectTrigger>
              <SelectContent>
                {employees.filter(e => e.status === 'active').map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <Select value={form.shift_type} onValueChange={v => setForm(f => ({ ...f, shift_type: v }))}>
              <SelectTrigger><SelectValue placeholder="סוג משמרת" /></SelectTrigger>
              <SelectContent>
                {Object.entries(shiftTypeConfig).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label} ({v.hours})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="הערות" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            <Button className="w-full" onClick={() => addShift.mutate(form)} disabled={!form.employee_id || !form.date || addShift.isPending}>
              {addShift.isPending ? 'שומר...' : 'הוסף משמרת'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}