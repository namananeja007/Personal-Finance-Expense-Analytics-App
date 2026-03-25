import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet, MdStar } from 'react-icons/md';
import useTransactions from '../hooks/useTransactions';
import useCurrency from '../hooks/useCurrency';
import { ExpensePieChart } from '../components/Charts';
import CurrencyWidget from '../components/CurrencyWidget';

const Dashboard = () => {
  const { allTransactions, totalIncome, totalExpenses, netBalance, topCategory } = useTransactions();
  const { format } = useCurrency();

  const cards = [
    { title: 'Total Balance', amount: netBalance, icon: <MdAccountBalanceWallet size={24} />, color: 'primary' },
    { title: 'Total Income', amount: totalIncome, icon: <MdTrendingUp size={24} />, color: 'success' },
    { title: 'Total Expenses', amount: totalExpenses, icon: <MdTrendingDown size={24} />, color: 'danger' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <h1>Dashboard</h1>
      
      <div className="grid-dashboard">
        {cards.map((card, index) => (
          <div className="card glass-panel flex-between" key={index}>
            <div>
              <h3 className="mb-4">{card.title}</h3>
              <h2 className={`text-${card.color} m-0`}>{format(card.amount)}</h2>
            </div>
            <div className={`btn-icon text-${card.color}`} style={{ background: `var(--surface-color)`, padding: '1rem', borderRadius: '50%' }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Expenses by Category</h2>
          <ExpensePieChart transactions={allTransactions} />
        </div>

        <CurrencyWidget />

        <div className="card">
          <h2>Insights</h2>
          {topCategory ? (
            <div className="mt-4">
              <div className="flex-between mb-4 glass-panel" style={{ padding: '1rem', borderRadius: '12px' }}>
                <div className="flex-center gap-2">
                  <MdStar className="text-primary" size={24} />
                  <div>
                    <h4 className="m-0">Top Spending Category</h4>
                    <p className="text-muted text-sm m-0">{topCategory.category}</p>
                  </div>
                </div>
                <h3 className="text-danger m-0">{format(topCategory.amount)}</h3>
              </div>
            </div>
          ) : (
            <p className="text-muted">Not enough data for insights.</p>
          )}

          <h3 className="mt-4 mb-4">Recent Transactions</h3>
          <div className="recent-list">
            {allTransactions.slice(0, 3).map(t => (
              <div key={t.id} className="flex-between mb-4" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong>{t.title}</strong>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{t.category}</div>
                </div>
                <div className={t.type === 'expense' ? 'text-danger' : 'text-success'}>
                  {t.type === 'expense' ? '-' : '+'}{format(t.amount)}
                </div>
              </div>
            ))}
            {allTransactions.length === 0 && <p className="text-muted">No recent transactions.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
