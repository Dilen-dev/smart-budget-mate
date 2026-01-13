import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { SavingsGoal } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Plus, 
  Trophy,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const CHALLENGES = [
  {
    id: 'challenge_1',
    name: 'No Spend Weekend',
    description: 'Avoid spending any money this weekend',
    reward: 'Budget Warrior badge progress',
    duration: '2 days',
  },
  {
    id: 'challenge_2',
    name: 'Save M200 Challenge',
    description: 'Save M200 this month towards your goals',
    reward: '50 points towards Savings Champion',
    duration: '1 month',
  },
  {
    id: 'challenge_3',
    name: 'Cook at Home Week',
    description: 'Prepare all meals at home for a week',
    reward: 'Food Saver badge',
    duration: '7 days',
  },
];

export default function Savings() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  const formatCurrency = (amount: number) => `M${amount.toFixed(0)}`;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-LS', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalTarget) {
      toast.error('Please fill in goal name and target amount');
      return;
    }

    addSavingsGoal({
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      deadline: newGoalDeadline ? new Date(newGoalDeadline) : undefined,
    });

    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDeadline('');
    setIsDialogOpen(false);
    toast.success('Savings goal created!');
  };

  const handleAddToGoal = (goal: SavingsGoal) => {
    const addAmount = 100; // Quick add M100
    const newAmount = Math.min(goal.currentAmount + addAmount, goal.targetAmount);
    updateSavingsGoal(goal.id, newAmount);
    toast.success(`Added M${addAmount} to ${goal.name}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Savings Goals
            </h1>
            <p className="text-muted-foreground mt-2">
              Set targets and track your progress towards financial goals
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Savings Goal</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    placeholder="e.g., New Laptop, Emergency Fund"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalTarget">Target Amount (M)</Label>
                  <Input
                    id="goalTarget"
                    type="number"
                    placeholder="e.g., 5000"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalDeadline">Deadline (Optional)</Label>
                  <Input
                    id="goalDeadline"
                    type="date"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>
                    Create Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card stat-card-primary text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-bold font-heading">
              {formatCurrency(savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0))}
            </p>
            <p className="text-sm opacity-80 mt-1">Total Saved</p>
          </div>
          <div className="stat-card text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold font-heading">
              {savingsGoals.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active Goals</p>
          </div>
          <div className="stat-card text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-warning" />
            <p className="text-3xl font-bold font-heading">
              {savingsGoals.filter(g => g.currentAmount >= g.targetAmount).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Goals Completed</p>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Your Savings Goals</h3>
          
          {savingsGoals.map((goal) => {
            const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const isComplete = percentage >= 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            
            return (
              <div key={goal.id} className={`stat-card ${isComplete ? 'border-success border-2' : ''}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{goal.name}</h4>
                      {isComplete && (
                        <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded-full font-medium">
                          Complete!
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(goal.deadline)}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={percentage} className="h-3" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {isComplete 
                        ? '🎉 Congratulations! You reached your goal!'
                        : `${formatCurrency(remaining)} remaining to reach your goal`
                      }
                    </p>
                  </div>

                  {!isComplete && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddToGoal(goal)}
                      className="shrink-0"
                    >
                      + Add M100
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {savingsGoals.length === 0 && (
            <div className="stat-card text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No savings goals yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first goal to start saving!
              </p>
            </div>
          )}
        </div>

        {/* Savings Challenges */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-warning" />
            <h3 className="font-semibold">Savings Challenges</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHALLENGES.map((challenge) => (
              <div key={challenge.id} className="stat-card hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-primary">{challenge.name}</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  {challenge.description}
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{challenge.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reward:</span>
                    <span className="text-success text-xs">{challenge.reward}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Start Challenge
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
