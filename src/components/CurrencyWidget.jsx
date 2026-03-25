import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../services/api';
import { MdCurrencyExchange, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { motion } from 'framer-motion';

const CurrencyWidget = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  // Currencies to display
  const targetCurrencies = ['EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  useEffect(() => {
    const getRates = async () => {
      const data = await fetchExchangeRates();
      if (data && data.rates) {
        setRates(data.rates);
      }
      setLoading(false);
    };
    getRates();
  }, []);

  if (loading) return (
    <div className="card glass-panel flex-center" style={{ minHeight: '150px' }}>
      <div className="text-muted spinner">Loading rates...</div>
    </div>
  );

  if (!rates) return null;

  return (
    <motion.div 
      className="card glass-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex-between mb-4">
        <div className="flex-center gap-2">
          <MdCurrencyExchange className="text-primary" size={24} />
          <h3 className="m-0 text-main">Live Exchange Rates</h3>
        </div>
        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>USD Base</span>
      </div>
      
      <div className="currency-grid">
        {targetCurrencies.map(currency => (
          <div key={currency} className="currency-item">
            <span className="text-muted">{currency}</span>
            <strong className="text-main">{rates[currency]?.toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CurrencyWidget;
