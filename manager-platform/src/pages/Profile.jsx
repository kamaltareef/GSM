import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Shield, Calendar, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => base44.entities.Station.list(),
  });

  const [form, setForm] = useState({ phone: '', city: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.auth.updateMe(form);
    setSaving(false);
    toast({ title: 'הפרופיל עודכן בהצלחה' });
  };

  const managedStation = stations.find(s => s.manager_email === user?.email);

  return (
    <div className="space-y-6 max-w-2xl" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">פרופיל מנהל</h1>
        <p className="text-sm text-muted-foreground mt-0.5">פרטי החשבון שלך</p>
      </motion.div>

      {/* Avatar + basic info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.full_name || 'משתמש'}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    <Shield className="w-3 h-3 ml-1" />
                    {user?.role === 'admin' ? 'מנהל מערכת' : 'משתמש'}
                  </Badge>
                  {user?.created_date && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 ml-1" />
                      חבר מ-{moment(user.created_date).format('MM/YYYY')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Managed station */}
      {managedStation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4" /> תחנה מנוהלת
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-semibold">{managedStation.name}</p>
              <p className="text-sm text-muted-foreground">{managedStation.address}, {managedStation.city}</p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>{managedStation.fuel_pumps_count} משאבות</span>
                {managedStation.charging_stations_count > 0 && <span>{managedStation.charging_stations_count} עמדות טעינה</span>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">עדכון פרטים</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>שם מלא</Label>
                  <Input value={user?.full_name || ''} disabled className="bg-secondary/30" />
                </div>
                <div>
                  <Label>אימייל</Label>
                  <Input value={user?.email || ''} disabled className="bg-secondary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>טלפון</Label>
                  <Input
                    placeholder="05X-XXXXXXX"
                    value={form.phone || user?.phone || ''}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>עיר</Label>
                  <Input
                    placeholder="תל אביב"
                    value={form.city || user?.city || ''}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'שומר...' : 'שמור שינויים'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}