import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Users, CalendarDays } from 'lucide-react';
import EmployeeList from '@/components/staff/EmployeeList';
import ShiftScheduler from '@/components/staff/ShiftScheduler';

export default function StaffPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">ניהול עובדים ומשמרות</h1>
        <p className="text-sm text-muted-foreground mt-0.5">ניהול צוות, פרטי עובדים וסידור עבודה</p>
      </motion.div>

      <Tabs defaultValue="employees" dir="rtl">
        <TabsList>
          <TabsTrigger value="employees" className="gap-1.5">
            <Users className="w-3.5 h-3.5" />עובדים
          </TabsTrigger>
          <TabsTrigger value="shifts" className="gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />סידור עבודה
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-4">
          <EmployeeList />
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <ShiftScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}