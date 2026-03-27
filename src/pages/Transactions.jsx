import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MdAdd, MdFileDownload, MdRefresh } from 'react-icons/md';
import TransactionCard from '../components/TransactionCard';
import useTransactions from '../hooks/useTransactions';
import useDebounce from '../hooks/useDebounce';

const Transactions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const debouncedSearch = useDebounce(search, 300);

  const { transactions, deleteTransaction } = useTransactions(
    debouncedSearch, typeFilter, categoryFilter, sortBy
  );

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('date');
  };

  const handleEdit = (transaction) => {
    navigate('/transactions/new', { state: { editTransaction: transaction } });
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Date', 'Type', 'Category', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => 
        `"${t.title}",${t.amount},"${t.date.split('T')[0]}","${t.type}","${t.category}","${t.notes || ''}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex-between mb-4">
        <h1>Transactions</h1>
        <div className="flex-center gap-2">
          <button className="btn btn-outline" onClick={exportToCSV}>
            <MdFileDownload size={20} /> Export CSV
          </button>
          <Link to="/transactions/new" className="btn btn-primary">
            <MdAdd size={20} /> Add Transaction
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex-between mb-2">
          <h3 className="m-0 text-muted">Filter & Sort</h3>
          {(search || typeFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'date') && (
            <button className="btn-icon text-muted" onClick={resetFilters} title="Reset Filters" style={{ fontSize: '0.85rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <MdRefresh size={16} /> Reset
            </button>
          )}
        </div>
        <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 0 }}>
          <div className="form-group mb-0">
            <label>Search</label>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Search by title or notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label>Type</label>
            <select className="input-base" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label>Category</label>
            <select className="input-base" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <label>Sort By</label>
            <select className="input-base" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      <div className="transactions-list">
        <AnimatePresence>
          {transactions.length > 0 ? (
            transactions.map(t => (
              <TransactionCard 
                key={t.id} 
                transaction={t} 
                onEdit={handleEdit}
                onDelete={deleteTransaction} 
              />
            ))
          ) : (
            <div className="text-center text-muted" style={{ padding: '3rem' }}>
              No transactions found matching your criteria.
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Transactions;
