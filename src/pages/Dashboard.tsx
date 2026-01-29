import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { PendingWithdrawals } from '@/components/dashboard/PendingWithdrawals';
import { useBudget } from '@/contexts/BudgetContext';
import { CATEGORY_SPENDING } from '@/lib/mockData';
import { Wallet, TrendingDown, PiggyBank, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { financialSummary, transactions, getPendingWithdrawals, user } = useBudget();
  const pendingWithdrawals = getPendingWithdrawals();

  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;

  const remainingBudget = 3500 - financialSummary.monthlyExpenses;

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold font-heading">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Here's your financial overview for January 2025
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingWithdrawals.length > 0 && (
              <PendingWithdrawals withdrawals={pendingWithdrawals} />
            )}
            <Link to="/budget-settings">
              <Button size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Alter Budget
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Total Budget"
            value={formatCurrency(3500)}
            icon={Wallet}
            variant="primary"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Remaining Budget"
            value={formatCurrency(remainingBudget)}
            subtitle={`${((remainingBudget / 3500) * 100).toFixed(0)}% remaining`}
            icon={TrendingDown}
            trend={{ value: 12.3, isPositive: remainingBudget > 0 }}
          />
          <StatCard
            title="Savings This Month"
            value={formatCurrency(financialSummary.monthlySavings)}
            subtitle="Target: M500"
            icon={PiggyBank}
            trend={{ value: 8.1, isPositive: true }}
          />
          <HealthScore score={financialSummary.healthScore} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart data={CATEGORY_SPENDING} />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </MainLayout>
  );
}
