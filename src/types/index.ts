export type TransactionType = 'credit' | 'debit' | 'withdrawal';

export type CategoryType = 
  | 'food' 
  | 'transport' 
  | 'accommodation' 
  | 'entertainment' 
  | 'utilities' 
  | 'education' 
  | 'health' 
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  merchant: string;
  description: string;
  date: Date;
  balance?: number;
  source: 'sms' | 'manual';
  rawSms?: string;
  isWithdrawal?: boolean;
  cashSpendingRecorded?: boolean;
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  budget?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  requirement: string;
  progress?: number;
  maxProgress?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  monthlyBudget?: number;
  savingsGoal?: number;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyExpenses: number;
  monthlySavings: number;
  healthScore: number;
  pendingWithdrawals: number;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
  savings: number;
}

export interface CategorySpending {
  category: CategoryType;
  amount: number;
  percentage: number;
}
