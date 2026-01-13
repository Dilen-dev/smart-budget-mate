import { SavingsGoal } from '@/types';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SavingsProgressProps {
  goals: SavingsGoal[];
}

export function SavingsProgress({ goals }: SavingsProgressProps) {
  const formatCurrency = (amount: number) => `M${amount.toFixed(0)}`;

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h4 className="text-sm font-medium text-muted-foreground">Savings Goals</h4>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              
              <Progress value={percentage} className="h-2" />
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(0)}% complete</span>
                {goal.deadline && (
                  <span>
                    Due: {new Intl.DateTimeFormat('en-LS', { 
                      month: 'short', 
                      year: 'numeric' 
                    }).format(new Date(goal.deadline))}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No savings goals yet</p>
            <p className="text-xs mt-1">Set a goal to start saving!</p>
          </div>
        )}
      </div>
    </div>
  );
}
