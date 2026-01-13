import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SavingsProgress } from '@/components/dashboard/SavingsProgress';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart';
import { PendingWithdrawals } from '@/components/dashboard/PendingWithdrawals';
import { useBudget } from '@/contexts/BudgetContext';
import { CATEGORY_SPENDING, MONTHLY_DATA } from '@/lib/mockData';
import { Wallet, TrendingDown, PiggyBank, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { financialSummary, transactions, savingsGoals, getPendingWithdrawals, user } = useBudget();
  const pendingWithdrawals = getPendingWithdrawals();

  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your financial overview for January 2025
            </p>
          </div>
          <Link to="/sms">
            <Button className="gap-2">
              <MessageSquareText className="h-4 w-4" />
              Add SMS
            </Button>
          </Link>
        </div>

        {/* Pending Withdrawals Alert */}
        {pendingWithdrawals.length > 0 && (
          <PendingWithdrawals withdrawals={pendingWithdrawals} />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Balance"
            value={formatCurrency(financialSummary.totalBalance)}
            icon={Wallet}
            variant="primary"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(financialSummary.monthlyExpenses)}
            subtitle="of M3,500 budget"
            icon={TrendingDown}
            trend={{ value: 12.3, isPositive: false }}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart data={CATEGORY_SPENDING} />
          <MonthlyTrendChart data={MONTHLY_DATA} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions transactions={transactions} />
          <SavingsProgress goals={savingsGoals} />
        </div>
      </div>
    </MainLayout>
  );
}
