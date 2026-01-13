import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  PiggyBank,
  Palette,
  Save,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetSettings() {
  const { user } = useBudget();
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget?.toString() || '3500');
  const [savingsTarget, setSavingsTarget] = useState(user?.savingsGoal?.toString() || '500');

  const handleSave = () => {
    toast.success('Budget settings saved successfully!');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            Budget Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your budget, savings targets, and categories
          </p>
        </div>

        {/* Monthly Budget */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Monthly Budget</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget (M)</Label>
            <Input
              id="budget"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your target spending limit per month
            </p>
          </div>
        </div>

        {/* Monthly Savings Target */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <PiggyBank className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Monthly Savings Target</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="savings">Monthly Savings Target (M)</Label>
            <Input
              id="savings"
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              How much you want to save each month
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Expense Categories</h3>
            </div>
            <Button variant="outline" size="sm">Add Category</Button>
          </div>

          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span>{cat.name}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
