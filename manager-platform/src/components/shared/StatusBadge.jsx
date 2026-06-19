import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const styles = {
  active: 'bg-primary/10 text-primary',
  operational: 'bg-primary/10 text-primary',
  available: 'bg-primary/10 text-primary',
  completed: 'bg-primary/10 text-primary',
  resolved: 'bg-primary/10 text-primary',
  closed: 'bg-muted text-muted-foreground',
  applied: 'bg-primary/10 text-primary',
  
  in_use: 'bg-accent/10 text-accent',
  in_progress: 'bg-accent/10 text-accent',
  charging: 'bg-accent/10 text-accent',
  preparing: 'bg-accent/10 text-accent',
  assigned: 'bg-accent/10 text-accent',
  
  pending: 'bg-chart-4/10 text-chart-4',
  waiting: 'bg-chart-4/10 text-chart-4',
  scheduled: 'bg-chart-4/10 text-chart-4',
  reserved: 'bg-chart-3/10 text-chart-3',
  
  low_level: 'bg-destructive/10 text-destructive',
  maintenance: 'bg-chart-4/10 text-chart-4',
  offline: 'bg-muted text-muted-foreground',
  cancelled: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/10 text-destructive',
  error: 'bg-destructive/10 text-destructive',
  refilling: 'bg-chart-3/10 text-chart-3',
  
  critical: 'bg-destructive/10 text-destructive',
  high: 'bg-accent/10 text-accent',
  medium: 'bg-chart-4/10 text-chart-4',
  low: 'bg-primary/10 text-primary',
  
  open: 'bg-accent/10 text-accent',
  ready: 'bg-primary/10 text-primary',
  delivered: 'bg-primary/10 text-primary'
};

const labels = {
  active: 'פעיל', operational: 'תקין', available: 'פנוי', completed: 'הושלם',
  resolved: 'נפתר', closed: 'סגור', applied: 'הוחל',
  in_use: 'בשימוש', in_progress: 'בביצוע', charging: 'נטען', preparing: 'בהכנה',
  assigned: 'הוקצה', pending: 'ממתין', waiting: 'ממתין', scheduled: 'מתוכנן',
  reserved: 'שמור', low_level: 'מפלס נמוך', maintenance: 'תחזוקה',
  offline: 'לא פעיל', cancelled: 'בוטל', failed: 'נכשל', error: 'שגיאה',
  refilling: 'מילוי', critical: 'קריטי', high: 'גבוה', medium: 'בינוני', low: 'נמוך',
  open: 'פתוח', ready: 'מוכן', delivered: 'נמסר'
};

export default function StatusBadge({ status, className }) {
  return (
    <Badge variant="secondary" className={cn("text-[10px] font-medium", styles[status] || 'bg-muted text-muted-foreground', className)}>
      {labels[status] || status}
    </Badge>
  );
}