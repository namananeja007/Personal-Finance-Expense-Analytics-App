import { motion } from 'framer-motion';
import { ExpensePieChart, IncomeVsExpenseChart, TrendLineChart } from '../components/Charts';
import useTransactions from '../hooks/useTransactions';

const Analytics = () => {
  const { allTransactions } = useTransactions();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1>Analytics</h1>
      
      <div className="grid-2">
        <div className="card col-span-2">
          <h2>Income vs Expense (Monthly)</h2>
          <IncomeVsExpenseChart transactions={allTransactions} />
        </div>

        <div className="card">
          <h2>Expenses by Category</h2>
          <ExpensePieChart transactions={allTransactions} />
        </div>

        <div className="card">
          <h2>Spending Trend</h2>
          <TrendLineChart transactions={allTransactions} />
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
