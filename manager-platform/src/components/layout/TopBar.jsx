import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="חיפוש..." 
            className="pr-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 h-9 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => navigate('/audit-log')}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10" onClick={() => navigate('/profile')}>
          <User className="w-4 h-4 text-primary" />
        </Button>
      </div>
    </header>
  );
}