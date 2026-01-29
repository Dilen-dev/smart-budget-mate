import { useState } from 'react';
import { Transaction } from '@/types';
import { AlertCircle, Banknote, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PendingWithdrawalsProps {
  withdrawals: Transaction[];
}

export function PendingWithdrawals({ withdrawals }: PendingWithdrawalsProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;

  if (withdrawals.length === 0 || isDismissed) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 rounded-full bg-warning/10 hover:bg-warning/20"
        >
          <Bell className="h-4 w-4 text-warning" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-[10px] font-medium text-warning-foreground flex items-center justify-center">
            {withdrawals.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <h4 className="font-medium text-sm">Cash Withdrawals</h4>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
          {withdrawals.slice(0, 5).map((w) => (
            <div key={w.id} className="flex items-center gap-2 text-sm">
              <Banknote className="h-4 w-4 text-warning" />
              <span className="font-medium">{formatCurrency(w.amount)}</span>
              <span className="text-muted-foreground text-xs">
                {new Intl.DateTimeFormat('en-LS', { 
                  day: 'numeric', 
                  month: 'short' 
                }).format(new Date(w.date))}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t">
          <Link to="/transactions?filter=withdrawals" className="block">
            <Button size="sm" variant="outline" className="w-full border-warning text-warning hover:bg-warning/10 text-xs">
              Record Cash Spending
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
