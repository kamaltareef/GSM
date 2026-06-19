import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Pencil, Trash2, Phone, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuditLog } from '@/hooks/useAuditLog';

const roleLabels = {
  manager: 'מנהל', cashier: 'קופאי', fueling_attendant: 'מתדלק',
  maintenance: 'תחזוקה', security: 'אבטחה'
};
const statusConfig = {
  active: { label: 'פעיל', cls: 'bg-primary/10 text-primary' },
  inactive: { label: 'לא פעיל', cls: 'bg-muted text-muted-foreground' },
  on_leave: { label: 'בחופשה', cls: 'bg-accent/10 text-accent' }
};

const EMPTY_FORM = { full_name: '', id_number: '', phone: '', email: '', role: 'cashier', status: 'active', start_date: '', hourly_rate: '', notes: '' };

export default function EmployeeList() {
  const qc = useQueryClient();
  const { log } = useAuditLog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list('-created_date')
  });

  const upsert = useMutation({
    mutationFn: async (data) => {
      if (editing) {
        await base44.entities.Employee.update(editing.id, data);
        await log({
          action: 'employee_updated',
          entity_type: 'Employee',
          entity_id: editing.id,
          details: `עובד עודכן: ${data.full_name}`,
          new_value: `${roleLabels[data.role] || data.role} • ${data.status}`,
        });
      } else {
        const emp = await base44.entities.Employee.create(data);
        await log({
          action: 'employee_created',
          entity_type: 'Employee',
          entity_id: emp.id,
          details: `עובד חדש נוצר: ${data.full_name}`,
          new_value: roleLabels[data.role] || data.role,
        });
      }
    },
    onSuccess: () => { qc.invalidateQueries(['employees']); setOpen(false); }
  });

  const remove = useMutation({
    mutationFn: async (emp) => {
      await base44.entities.Employee.delete(emp.id);
      await log({
        action: 'employee_deleted',
        entity_type: 'Employee',
        entity_id: emp.id,
        details: `עובד נמחק: ${emp.full_name}`,
        old_value: roleLabels[emp.role] || emp.role,
      });
    },
    onSuccess: () => qc.invalidateQueries(['employees'])
  });

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setForm({ ...EMPTY_FORM, ...emp }); setOpen(true); };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{employees.length}</span> עובדים רשומים
        </div>
        <Button onClick={openAdd} size="sm" className="gap-1.5">
          <UserPlus className="w-4 h-4" />הוסף עובד
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp, i) => (
          <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{emp.full_name}</p>
                      <p className="text-xs text-muted-foreground">{roleLabels[emp.role] || emp.role}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] ${statusConfig[emp.status]?.cls || 'bg-muted text-muted-foreground'}`}>
                    {statusConfig[emp.status]?.label || emp.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  {emp.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{emp.phone}</div>}
                  {emp.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{emp.email}</div>}
                  {emp.hourly_rate && <div className="text-xs font-medium text-primary">₪{emp.hourly_rate} לשעה</div>}
                  {emp.start_date && <div>תחילת עבודה: {emp.start_date}</div>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs" onClick={() => openEdit(emp)}>
                    <Pencil className="w-3 h-3 ml-1" />עריכה
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => remove.mutate(emp)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {employees.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground text-sm">
            לא נמצאו עובדים — הוסף עובד ראשון
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? 'עריכת עובד' : 'הוספת עובד חדש'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="שם מלא *" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            <Input placeholder="תעודת זהות" value={form.id_number} onChange={e => setForm(f => ({ ...f, id_number: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="טלפון" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Input placeholder="אימייל" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue placeholder="תפקיד" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue placeholder="סטטוס" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" placeholder="תאריך תחילת עבודה" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input type="number" placeholder="שכר לשעה (₪)" value={form.hourly_rate} onChange={e => setForm(f => ({ ...f, hourly_rate: e.target.value }))} />
            </div>
            <Input placeholder="הערות" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            <Button className="w-full" onClick={() => upsert.mutate(form)} disabled={!form.full_name || upsert.isPending}>
              {upsert.isPending ? 'שומר...' : editing ? 'עדכן עובד' : 'הוסף עובד'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}