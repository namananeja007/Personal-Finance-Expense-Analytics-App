import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';

const useTransactions = (searchQuery = '', filterType = 'all', filterCategory = 'all', sortBy = 'date') => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, resetApp } = useContext(FinanceContext);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        (t.notes && t.notes.toLowerCase().includes(lowerQuery))
      );
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [transactions, searchQuery, filterType, filterCategory, sortBy]);

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpenses;

  // Calculate top spending category
  const topCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return null;

    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return top ? { category: top[0], amount: top[1] } : null;
  }, [transactions]);

  return {
    transactions: filteredAndSortedTransactions,
    allTransactions: transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetApp,
    totalIncome,
    totalExpenses,
    netBalance,
    topCategory
  };
};

export default useTransactions;
