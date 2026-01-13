import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { CATEGORIES } from '@/lib/mockData';
import { Transaction, CategoryType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Receipt, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Banknote,
  Filter,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Transactions() {
  const { transactions, recategorizeTransaction, deleteTransaction } = useBudget();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryType>('other');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || txn.category === categoryFilter;
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-LS', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="h-5 w-5 text-success" />;
      case 'withdrawal':
        return <Banknote className="h-5 w-5 text-warning" />;
      default:
        return <ArrowUpRight className="h-5 w-5 text-destructive" />;
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const handleRecategorize = () => {
    if (editingTransaction) {
      recategorizeTransaction(editingTransaction.id, newCategory);
      setEditingTransaction(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
            <Receipt className="h-8 w-8 text-primary" />
            Transactions
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your financial transactions
          </p>
        </div>

        {/* Filters */}
        <div className="stat-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Income</SelectItem>
                  <SelectItem value="debit">Expense</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.map((txn) => {
            const category = getCategoryInfo(txn.category);
            
            return (
              <div key={txn.id} className="transaction-row animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    {getTransactionIcon(txn.type)}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-medium truncate">{txn.merchant}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="category-pill bg-muted text-muted-foreground">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(txn.date)}
                      </span>
                      {txn.source === 'sms' && (
                        <span className="text-xs text-info">SMS</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      txn.type === 'credit' ? 'text-success' : 'text-foreground'
                    }`}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    {txn.balance && (
                      <p className="text-xs text-muted-foreground">
                        Bal: {formatCurrency(txn.balance)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingTransaction(txn);
                        setNewCategory(txn.category);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteTransaction(txn.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your filters or add new transactions</p>
            </div>
          )}
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Category</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Recategorize "{editingTransaction?.merchant}" transaction
              </p>
              
              <Select value={newCategory} onValueChange={(v) => setNewCategory(v as CategoryType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                  Cancel
                </Button>
                <Button onClick={handleRecategorize}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
