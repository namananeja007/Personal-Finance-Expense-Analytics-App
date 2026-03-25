import { useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

export const ExpensePieChart = ({ transactions }) => {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) return <div className="text-center text-muted py-8">No expense data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `$${value.toFixed(2)}`}
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const IncomeVsExpenseChart = ({ transactions }) => {
  const data = useMemo(() => {
    // Group by month
    const monthly = transactions.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
      
      if (curr.type === 'income') acc[month].income += curr.amount;
      else acc[month].expense += curr.amount;
      
      return acc;
    }, {});

    return Object.values(monthly);
  }, [transactions]);

  if (data.length === 0) return <div className="text-center text-muted py-8">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          formatter={(value) => `$${value.toFixed(2)}`}
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
        />
        <Legend />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TrendLineChart = ({ transactions }) => {
  const data = useMemo(() => {
    // Group by date to show trend
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Sort by date
    const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const trend = sorted.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = { date, amount: 0 };
      acc[date].amount += curr.amount;
      return acc;
    }, {});

    return Object.values(trend);
  }, [transactions]);

  if (data.length === 0) return <div className="text-center text-muted py-8">No expense data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          formatter={(value) => `$${value.toFixed(2)}`}
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
        />
        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
