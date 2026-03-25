import { MdEdit, MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import useCurrency from '../hooks/useCurrency';
import { 
  MdFastfood, MdCardTravel, MdHome, MdShoppingBag, 
  MdMovie, MdHealthAndSafety, MdLightbulb, MdSubscriptions,
  MdAttachMoney
} from 'react-icons/md';

const categoryIcons = {
  Food: <MdFastfood />,
  Travel: <MdCardTravel />,
  Rent: <MdHome />,
  Shopping: <MdShoppingBag />,
  Entertainment: <MdMovie />,
  Health: <MdHealthAndSafety />,
  Utilities: <MdLightbulb />,
  Subscriptions: <MdSubscriptions />
};

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { format: formatCurrency } = useCurrency();
  const isExpense = transaction.type === 'expense';

  return (
    <motion.div 
      className="transaction-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="t-info">
        <div className={`t-icon ${isExpense ? 'expense' : 'income'}`}>
          {isExpense ? categoryIcons[transaction.category] || <MdAttachMoney /> : <MdAttachMoney />}
        </div>
        <div className="t-details">
          <h4>{transaction.title}</h4>
          <p>
            {format(new Date(transaction.date), 'MMM dd, yyyy')} • {transaction.category} 
            {transaction.recurring && <span className="badge badge-recurring" style={{ marginLeft: '8px' }}>Recurring</span>}
          </p>
        </div>
      </div>
      
      <div className="t-actions">
        <div className={`t-amount ${isExpense ? 'text-danger' : 'text-success'}`}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
        </div>
        <div className="flex-center gap-2">
          <button className="btn-icon text-muted" onClick={() => onEdit(transaction)} title="Edit">
            <MdEdit size={18} />
          </button>
          <button className="btn-icon text-danger" onClick={() => onDelete(transaction.id)} title="Delete">
            <MdDelete size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
