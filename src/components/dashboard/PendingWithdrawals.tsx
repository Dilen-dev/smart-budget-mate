import { Transaction } from '@/types';
import { AlertCircle, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PendingWithdrawalsProps {
  withdrawals: Transaction[];
}

export function PendingWithdrawals({ withdrawals }: PendingWithdrawalsProps) {
  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;

  if (withdrawals.length === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-warning/20">
          <AlertCircle className="h-5 w-5 text-warning" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-foreground">Cash Withdrawals Need Recording</h4>
          <p className="text-sm text-muted-foreground mt-1">
            You have {withdrawals.length} cash withdrawal{withdrawals.length > 1 ? 's' : ''} that need spending records.
          </p>
          
          <div className="mt-3 space-y-2">
            {withdrawals.slice(0, 3).map((w) => (
              <div key={w.id} className="flex items-center gap-2 text-sm">
                <Banknote className="h-4 w-4 text-warning" />
                <span>{formatCurrency(w.amount)}</span>
                <span className="text-muted-foreground">
                  on {new Intl.DateTimeFormat('en-LS', { 
                    day: 'numeric', 
                    month: 'short' 
                  }).format(new Date(w.date))}
                </span>
              </div>
            ))}
          </div>
          
          <Link to="/transactions?filter=withdrawals" className="inline-block mt-3">
            <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning/10">
              Record Cash Spending
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
