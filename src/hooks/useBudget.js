import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';

const useBudget = () => {
  const { transactions, budget, setBudget } = useContext(FinanceContext);

  const budgetStats = useMemo(() => {
    // Only count expenses towards budget
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const safeBudget = budget || 0;
    const remaining = Math.max(0, safeBudget - totalExpenses);
    const percentageUsed = safeBudget > 0 ? (totalExpenses / safeBudget) * 100 : 0;
    
    return {
      totalBudget: safeBudget,
      totalExpenses,
      remaining,
      percentageUsed: Math.min(percentageUsed, 100), // Cap at 100 for proper UI scale, though we might want to show over-budget visually
      isOverBudget: totalExpenses > safeBudget
    };
  }, [transactions, budget]);

  return {
    budget,
    setBudget,
    ...budgetStats
  };
};

export default useBudget;
