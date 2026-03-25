import { useMemo } from 'react';

const useCurrency = () => {
  const format = useMemo(() => {
    return (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };
  }, []);

  return { format };
};

export default useCurrency;
