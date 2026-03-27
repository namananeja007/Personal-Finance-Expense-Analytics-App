import { motion } from 'framer-motion';
import { ExpensePieChart, IncomeVsExpenseChart } from '../components/Charts';
import { TrackingGraphDemo } from '../components/ui/demo';
import useTransactions from '../hooks/useTransactions';

const Analytics = () => {
  const { allTransactions } = useTransactions();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1>Analytics</h1>
      
      <div className="card glass-panel col-span-2 mb-4">
        <h2>Advanced Spending Tracker (Visx)</h2>
        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          <TrackingGraphDemo transactions={allTransactions} width={1000} height={400} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card col-span-2">
          <h2>Income vs Expense (Monthly)</h2>
          <IncomeVsExpenseChart transactions={allTransactions} />
        </div>

        <div className="card">
          <h2>Expenses by Category</h2>
          <ExpensePieChart transactions={allTransactions} />
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
