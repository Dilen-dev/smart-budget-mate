import { MainLayout } from '@/components/layout/MainLayout';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart';
import { CATEGORY_SPENDING, MONTHLY_DATA, CATEGORIES } from '@/lib/mockData';
import { useBudget } from '@/contexts/BudgetContext';
import { PieChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const { transactions, financialSummary } = useBudget();

  const formatCurrency = (amount: number) => `M${amount.toFixed(2)}`;

  // Calculate totals by category
  const categoryTotals = CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.category === cat.id && t.type !== 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    return { category: cat.name, amount: total };
  }).filter(c => c.amount > 0);

  const savingsTrend = MONTHLY_DATA.map(m => ({
    month: m.month,
    savings: m.savings,
    target: 500,
  }));

  const handleDownload = () => {
    // Generate simple CSV report
    const csvContent = [
      ['SmartBudget Monthly Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Summary'],
      ['Total Balance', formatCurrency(financialSummary.totalBalance)],
      ['Monthly Expenses', formatCurrency(financialSummary.monthlyExpenses)],
      ['Monthly Savings', formatCurrency(financialSummary.monthlySavings)],
      ['Health Score', `${financialSummary.healthScore}/100`],
      [''],
      ['Category Breakdown'],
      ...categoryTotals.map(c => [c.category, formatCurrency(c.amount)]),
      [''],
      ['Recent Transactions'],
      ['Date', 'Merchant', 'Category', 'Amount'],
      ...transactions.slice(0, 20).map(t => [
        new Date(t.date).toLocaleDateString(),
        t.merchant,
        t.category,
        `${t.type === 'credit' ? '+' : '-'}${formatCurrency(t.amount)}`
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartbudget-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
              <PieChart className="h-8 w-8 text-primary" />
              Financial Reports
            </h1>
            <p className="text-muted-foreground mt-2">
              Detailed insights into your spending patterns
            </p>
          </div>
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold font-heading mt-1">
              {formatCurrency(financialSummary.monthlyExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-sm text-muted-foreground">Average Daily</p>
            <p className="text-2xl font-bold font-heading mt-1">
              {formatCurrency(financialSummary.monthlyExpenses / 11)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Spending</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold font-heading mt-1">
              {transactions.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total logged</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-2xl font-bold font-heading mt-1">
              Accommodation
            </p>
            <p className="text-xs text-muted-foreground mt-1">35% of spending</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart data={CATEGORY_SPENDING} />
          <MonthlyTrendChart data={MONTHLY_DATA} />
        </div>

        {/* Savings Trend */}
        <div className="stat-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Savings Trend</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => `M${v}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`M${value}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Actual Savings"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="stat-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Category Breakdown</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">% of Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_SPENDING.map((cat) => (
                  <tr key={cat.category} className="border-b border-border/50">
                    <td className="py-3 px-4">
                      {CATEGORIES.find(c => c.id === cat.category)?.name || cat.category}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(cat.amount)}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {cat.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
