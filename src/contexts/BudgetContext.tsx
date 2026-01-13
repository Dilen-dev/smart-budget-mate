import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  Transaction, 
  Badge, 
  SavingsGoal, 
  FinancialSummary, 
  User,
  CategoryType 
} from '@/types';
import { 
  SAMPLE_TRANSACTIONS, 
  SAMPLE_BADGES, 
  SAMPLE_SAVINGS_GOALS, 
  FINANCIAL_SUMMARY,
  SAMPLE_USER 
} from '@/lib/mockData';
import { smsToTransaction, checkDuplicate } from '@/lib/smsParser';

interface BudgetContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  badges: Badge[];
  savingsGoals: SavingsGoal[];
  financialSummary: FinancialSummary;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  
  // Transaction actions
  addTransaction: (transaction: Transaction) => void;
  addTransactionFromSMS: (smsText: string) => { success: boolean; message: string; transaction?: Transaction };
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  recategorizeTransaction: (id: string, category: CategoryType) => void;
  recordCashSpending: (withdrawalId: string, transactions: Omit<Transaction, 'id'>[]) => void;
  
  // Savings actions
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, amount: number) => void;
  
  // Utility
  getPendingWithdrawals: () => Transaction[];
  calculateHealthScore: () => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [badges, setBadges] = useState<Badge[]>(SAMPLE_BADGES);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(SAMPLE_SAVINGS_GOALS);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(FINANCIAL_SUMMARY);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password.length >= 6) {
      setUser(SAMPLE_USER);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (name && email && password.length >= 6) {
      setUser({ ...SAMPLE_USER, name, email });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    updateFinancialSummary();
  }, []);

  const addTransactionFromSMS = useCallback((smsText: string) => {
    // Check for duplicates
    if (checkDuplicate(smsText, transactions)) {
      return { success: false, message: 'This SMS has already been processed.' };
    }

    const transaction = smsToTransaction(smsText);
    
    if (!transaction) {
      return { success: false, message: 'Could not parse transaction from SMS. Please check the format.' };
    }

    setTransactions(prev => [transaction, ...prev]);
    updateFinancialSummary();
    
    return { 
      success: true, 
      message: transaction.isWithdrawal 
        ? 'Cash withdrawal detected. Please record how you spent this cash.'
        : 'Transaction added successfully.',
      transaction 
    };
  }, [transactions]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(txn => txn.id === id ? { ...txn, ...updates } : txn)
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(txn => txn.id !== id));
    updateFinancialSummary();
  }, []);

  const recategorizeTransaction = useCallback((id: string, category: CategoryType) => {
    setTransactions(prev => 
      prev.map(txn => txn.id === id ? { ...txn, category } : txn)
    );
  }, []);

  const recordCashSpending = useCallback((withdrawalId: string, newTransactions: Omit<Transaction, 'id'>[]) => {
    const txnsWithIds = newTransactions.map((txn, idx) => ({
      ...txn,
      id: `txn_cash_${Date.now()}_${idx}`,
    }));
    
    setTransactions(prev => [
      ...prev.map(txn => 
        txn.id === withdrawalId ? { ...txn, cashSpendingRecorded: true } : txn
      ),
      ...txnsWithIds,
    ]);
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date(),
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  }, []);

  const updateSavingsGoal = useCallback((id: string, amount: number) => {
    setSavingsGoals(prev => 
      prev.map(goal => goal.id === id ? { ...goal, currentAmount: amount } : goal)
    );
  }, []);

  const getPendingWithdrawals = useCallback(() => {
    return transactions.filter(txn => txn.isWithdrawal && !txn.cashSpendingRecorded);
  }, [transactions]);

  const calculateHealthScore = useCallback(() => {
    // Simple health score calculation
    const totalExpenses = transactions
      .filter(t => t.type === 'debit' && t.date.getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);
    
    const budget = user?.monthlyBudget || 3500;
    const ratio = totalExpenses / budget;
    
    if (ratio <= 0.7) return 90;
    if (ratio <= 0.85) return 75;
    if (ratio <= 1.0) return 60;
    if (ratio <= 1.2) return 40;
    return 20;
  }, [transactions, user]);

  const updateFinancialSummary = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const monthlyTxns = transactions.filter(t => t.date.getMonth() === currentMonth);
    
    const expenses = monthlyTxns
      .filter(t => t.type === 'debit' || t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const income = monthlyTxns
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const latestBalance = transactions[0]?.balance || financialSummary.totalBalance;

    setFinancialSummary({
      totalBalance: latestBalance,
      monthlyExpenses: expenses,
      monthlySavings: Math.max(0, income - expenses),
      healthScore: calculateHealthScore(),
      pendingWithdrawals: getPendingWithdrawals().length,
    });
  }, [transactions, calculateHealthScore, getPendingWithdrawals, financialSummary.totalBalance]);

  const value: BudgetContextType = {
    user,
    isAuthenticated,
    transactions,
    badges,
    savingsGoals,
    financialSummary,
    login,
    logout,
    register,
    addTransaction,
    addTransactionFromSMS,
    updateTransaction,
    deleteTransaction,
    recategorizeTransaction,
    recordCashSpending,
    addSavingsGoal,
    updateSavingsGoal,
    getPendingWithdrawals,
    calculateHealthScore,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
