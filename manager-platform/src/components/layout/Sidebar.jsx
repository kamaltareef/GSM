import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Fuel, Zap, ShoppingBag, Wrench, 
  BarChart3, Settings, Building2, ChevronLeft, ChevronRight, Users, Shield, PackageSearch, Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'לוח בקרה', section: 'ניהול' },
  { path: '/stations', icon: Building2, label: 'תחנות', section: 'ניהול' },
  { path: '/fuel', icon: Fuel, label: 'תדלוק', section: 'תפעול' },
  { path: '/charging', icon: Zap, label: 'טעינה', section: 'תפעול' },
  { path: '/orders', icon: ShoppingBag, label: 'הזמנות', section: 'תפעול' },
  { path: '/maintenance', icon: Wrench, label: 'תחזוקה', section: 'תפעול' },
  { path: '/staff', icon: Users, label: 'עובדים', section: 'תפעול' },
  { path: '/inventory', icon: Boxes, label: 'מלאי חנות', section: 'תפעול' },
  { path: '/purchase-orders', icon: PackageSearch, label: 'הזמנות רכש', section: 'תפעול' },
  { path: '/reports', icon: BarChart3, label: 'דוחות', section: 'ניתוח' },
  { path: '/audit-log', icon: Shield, label: 'יומן ביקורת', section: 'ניתוח' },
  { path: '/settings', icon: Settings, label: 'הגדרות', section: 'ניתוח' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  
  const sections = [...new Set(navItems.map(item => item.section))];

  return (
    <aside className={cn(
      "fixed top-0 right-0 h-screen bg-sidebar z-40 transition-all duration-300 flex flex-col border-l border-sidebar-border",
      collapsed ? "w-[72px]" : "w-[240px]"
    )}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border min-h-[64px]">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Fuel className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-bold text-sidebar-foreground text-lg whitespace-nowrap font-inter tracking-tight">GSM</h1>
              <p className="text-[10px] text-sidebar-foreground/50 whitespace-nowrap">Gas Station Management</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sections.map(section => (
          <div key={section} className="mb-4">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2"
                >
                  {section}
                </motion.p>
              )}
            </AnimatePresence>
            {navItems.filter(item => item.section === section).map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 group relative",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20" 
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-sm")} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {collapsed && (
                    <div className="absolute right-full mr-2 px-2 py-1 bg-foreground text-background rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}