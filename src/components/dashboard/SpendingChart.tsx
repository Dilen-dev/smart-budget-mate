import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategorySpending } from '@/types';
import { CATEGORIES } from '@/lib/mockData';

interface SpendingChartProps {
  data: CategorySpending[];
}

const CATEGORY_COLORS: Record<string, string> = {
  food: '#F59E0B',
  transport: '#0EA5E9',
  accommodation: '#A855F7',
  entertainment: '#EC4899',
  utilities: '#14B8A6',
  education: '#22C55E',
  health: '#EF4444',
  other: '#6B7280',
};

export function SpendingChart({ data }: SpendingChartProps) {
  const formatCurrency = (amount: number) => `M${amount.toFixed(0)}`;
  
  const chartData = data.map(item => ({
    ...item,
    name: CATEGORIES.find(c => c.id === item.category)?.name || item.category,
    color: CATEGORY_COLORS[item.category],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(item.amount)} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stat-card animate-fade-in">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">Spending by Category</h4>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-2">
          {chartData.slice(0, 5).map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm flex-1">{item.name}</span>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
