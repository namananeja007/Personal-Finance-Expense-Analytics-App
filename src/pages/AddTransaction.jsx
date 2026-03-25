import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useTransactions from '../hooks/useTransactions';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.date().required('Date is required').typeError('Invalid date'),
  notes: yup.string(),
  recurring: yup.boolean()
}).required();

const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions', 'Salary', 'Other'];

const AddTransaction = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    }
  });

  const transactionType = watch('type');

  const onSubmit = (data) => {
    try {
      const newTransaction = {
        ...data,
        id: uuidv4(),
        date: data.date.toISOString() // Transform date object to ISO string
      };
      
      addTransaction(newTransaction);
      toast.success('Transaction added successfully!');
      navigate('/transactions');
    } catch (error) {
      toast.error('Failed to add transaction.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1>Add Transaction</h1>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid-2">
            <div className="form-group col-span-2">
              <label>Type</label>
              <div className="flex-center gap-4">
                <label className="flex-center gap-2" style={{ cursor: 'pointer' }}>
                  <input type="radio" value="expense" {...register('type')} />
                  Expense
                </label>
                <label className="flex-center gap-2" style={{ cursor: 'pointer' }}>
                  <input type="radio" value="income" {...register('type')} />
                  Income
                </label>
              </div>
            </div>

            <div className="form-group col-span-2">
              <label>Title</label>
              <input type="text" className="input-base" placeholder="e.g., Groceries" {...register('title')} />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" step="0.01" className="input-base" placeholder="0.00" {...register('amount')} />
              {errors.amount && <p className="error-text">{errors.amount.message}</p>}
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" className="input-base" {...register('date')} />
              {errors.date && <p className="error-text">{errors.date.message}</p>}
            </div>

            <div className="form-group col-span-2">
              <label>Category</label>
              <select className="input-base" {...register('category')}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="error-text">{errors.category.message}</p>}
            </div>

            <div className="form-group col-span-2">
              <label>Notes (Optional)</label>
              <textarea className="input-base" rows="3" placeholder="Add some details..." {...register('notes')} />
            </div>

            <div className="form-group col-span-2">
              <label className="flex-between glass-panel" style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', margin: 0 }}>
                <span>Mark as Recurring</span>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} {...register('recurring')} />
              </label>
            </div>

          </div>

          <div className="mt-4 flex-between">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Save Transaction
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default AddTransaction;
