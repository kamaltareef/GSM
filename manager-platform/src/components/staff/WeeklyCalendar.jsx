import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Sun, Sunset, Moon } from 'lucide-react';
import moment from 'moment';

const shiftTypeConfig = {
  morning:   { label: 'בוקר',   hours: '06:00–14:00', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', rowCls: 'bg-yellow-50/60', icon: Sun },
  afternoon: { label: 'צהריים', hours: '14:00–22:00', cls: 'bg-blue-100 text-blue-800 border-blue-200',   rowCls: 'bg-blue-50/60',   icon: Sunset },
  night:     { label: 'לילה',   hours: '22:00–06:00', cls: 'bg-purple-100 text-purple-800 border-purple-200', rowCls: 'bg-purple-50/60', icon: Moon },
};

const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function getWeekDays(weekOffset = 0) {
  const start = moment().startOf('isoWeek').add(weekOffset, 'weeks');
  return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'days'));
}

export default function WeeklyCalendar({ shifts = [], weekOffset = 0, onRemove }) {
  const weekDays = getWeekDays(weekOffset);

  return (
    <div className="overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="bg-secondary/50">
            <th className="p-3 w-28 text-right text-xs font-semibold text-muted-foreground border-b border-border/40">משמרת</th>
            {weekDays.map((day, i) => {
              const isToday = day.isSame(moment(), 'day');
              const dayShifts = shifts.filter(s => s.date === day.format('YYYY-MM-DD'));
              return (
                <th key={i} className={`p-2 text-center border-b border-r border-border/30 last:border-r-0 ${isToday ? 'bg-primary/10' : ''}`}>
                  <p className={`text-[11px] font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {hebrewDays[day.day()]}
                  </p>
                  <p className={`text-lg font-bold font-inter leading-tight ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day.format('DD')}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{day.format('MM/YY')}</p>
                  {dayShifts.length > 0 && (
                    <div className="mt-1">
                      <span className="inline-block text-[9px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                        {dayShifts.length} משמרות
                      </span>
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(shiftTypeConfig).map(([type, cfg]) => {
            const Icon = cfg.icon;
            return (
              <tr key={type} className={`${cfg.rowCls} border-b border-border/30 last:border-b-0`}>
                <td className="p-3 border-r border-border/30">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 opacity-70" />
                    <div>
                      <p className="text-xs font-semibold">{cfg.label}</p>
                      <p className="text-[10px] text-muted-foreground font-inter">{cfg.hours}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const dayStr = day.format('YYYY-MM-DD');
                  const isToday = day.isSame(moment(), 'day');
                  const cellShifts = shifts.filter(s => s.date === dayStr && s.shift_type === type);
                  return (
                    <td key={dayStr} className={`p-1.5 border-r border-border/20 last:border-r-0 align-top min-h-[60px] ${isToday ? 'bg-primary/5' : ''}`}>
                      <div className="space-y-1 min-h-[50px]">
                        {cellShifts.map(shift => (
                          <div
                            key={shift.id}
                            className={`rounded-lg border px-2 py-1 text-[10px] group relative ${cfg.cls}`}
                          >
                            <p className="font-semibold truncate leading-tight">{shift.employee_name || '—'}</p>
                            {shift.status === 'absent' && (
                              <span className="text-red-600 font-bold text-[9px]">✗ לא הגיע</span>
                            )}
                            {shift.status === 'in_progress' && (
                              <span className="text-green-700 font-bold text-[9px]">● בפעילות</span>
                            )}
                            {onRemove && (
                              <button
                                onClick={() => onRemove(shift.id)}
                                className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        {cellShifts.length === 0 && (
                          <div className="text-center text-[10px] text-muted-foreground/40 pt-2">—</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}