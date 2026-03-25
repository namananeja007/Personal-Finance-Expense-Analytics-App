import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('finance_budget');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (budget !== null) {
      localStorage.setItem('finance_budget', JSON.stringify(budget));
    }
  }, [budget]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const resetApp = () => {
    setTransactions([]);
    setBudget(null);
    localStorage.removeItem('finance_budget');
    localStorage.removeItem('finance_transactions');
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budget,
      setBudget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      resetApp
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
