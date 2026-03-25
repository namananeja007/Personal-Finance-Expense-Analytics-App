import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useBudget from '../hooks/useBudget';
import useCurrency from '../hooks/useCurrency';

const Budget = () => {
  const { budget, setBudget, totalBudget, totalExpenses, remaining, percentageUsed, isOverBudget } = useBudget();
  const { format } = useCurrency();
  const [editMode, setEditMode] = useState(!budget);
  const [budgetInput, setBudgetInput] = useState(budget || '');

  const handleSave = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
      setEditMode(false);
      toast.success('Budget updated successfully');
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const pbClass = isOverBudget ? 'danger' : percentageUsed > 80 ? 'warning' : 'safe';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1>Monthly Budget</h1>
      
      <div className="card glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        
        {editMode ? (
          <div>
            <h2>Set Your Monthly Budget</h2>
            <p className="text-muted mb-4">Tracking a budget helps you keep your expenses under control.</p>
            <div className="form-group">
              <div className="flex-between gap-4">
                <input 
                  type="number" 
                  className="input-base" 
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                  placeholder="0.00"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
            {budget && (
              <button className="btn btn-outline mt-4" onClick={() => setEditMode(false)}>Cancel</button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex-between mb-4">
              <h2 className="m-0">Budget Overview</h2>
              <button className="btn btn-outline" onClick={() => setEditMode(true)}>Edit</button>
            </div>
            
            <div className="mb-4">
              <div className="flex-between mb-2">
                <span className="text-muted">Spent: <strong className="text-main">{format(totalExpenses)}</strong></span>
                <span className="text-muted">Total: <strong className="text-main">{format(totalBudget)}</strong></span>
              </div>
              <div className="progress-bar" style={{ height: '24px' }}>
                <div 
                  className={`progress-fill ${pbClass}`} 
                  style={{ width: `${percentageUsed}%` }}
                ></div>
              </div>
              <div className="flex-between mt-2">
                <span className={isOverBudget ? 'text-danger' : 'text-success'} style={{ fontWeight: 600 }}>
                  {isOverBudget ? 'Over Budget by:' : 'Remaining:'} {format(Math.abs(remaining - (isOverBudget ? Math.abs(totalBudget - totalExpenses) : 0)))}
                </span>
                <span className="text-muted">{percentageUsed.toFixed(1)}% Used</span>
              </div>
            </div>

            {isOverBudget && (
              <div className="glass-panel text-danger mt-4" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)' }}>
                <strong>Warning:</strong> You have exceeded your monthly budget. Please review your expenses.
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default Budget;
