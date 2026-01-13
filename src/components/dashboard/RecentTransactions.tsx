import { Transaction } from '@/types';
import { CATEGORIES } from '@/lib/mockData';
import { ArrowDownLeft, ArrowUpRight, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-LS', { 
      day: 'numeric', 
      month: 'short' 
    }).format(new Date(date));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'withdrawal':
        return <Banknote className="h-4 w-4 text-warning" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-muted-foreground">Recent Transactions</h4>
        <Link to="/transactions">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View all
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((txn) => {
          const category = getCategoryInfo(txn.category);
          
          return (
            <div key={txn.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-lg bg-${category.color}/10`}>
                {getTransactionIcon(txn.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{txn.merchant}</p>
                <p className="text-xs text-muted-foreground">{category.name}</p>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  txn.type === 'credit' ? 'text-success' : 'text-foreground'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Add your first SMS to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
