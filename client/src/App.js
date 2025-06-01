import { useEffect, useState } from 'react';
import api from './api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await api.get('/expenses');
    setExpenses(res.data);
  };

  const addExpense = async () => {
    if (!title || !amount || !category) return;
    await api.post('/expenses', { title, amount, category });
    fetchExpenses();
    setTitle('');
    setAmount('');
    setCategory('');
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = filterCategory
      ? exp.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;

    const expenseDate = new Date(exp.date);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    const matchesStart = startDate ? expenseDate >= startDate : true;
    const matchesEnd = endDate ? expenseDate <= endDate : true;

    return matchesCategory && matchesStart && matchesEnd;
  });

  const getCategoryData = () => {
    const categoryMap = {};

    filteredExpenses.forEach(exp => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699'];

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>

      <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category"
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        />
        <input
          type="date"
          value={filterStartDate}
          onChange={e => setFilterStartDate(e.target.value)}
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={e => setFilterEndDate(e.target.value)}
        />
        <button
          onClick={() => {
            setFilterCategory('');
            setFilterStartDate('');
            setFilterEndDate('');
          }}
        >
          Clear Filters
        </button>
      </div>

      {filteredExpenses.length > 0 && (
        <div className="piechart-container">
          <h2>Spending by Category</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={getCategoryData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {getCategoryData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      )}

      <ul className="expense-list">
        {filteredExpenses.map(exp => (
          <li key={exp._id} className="expense-item">
            <span>{exp.title} - ${exp.amount} ({exp.category})</span>
            <button
              onClick={() => deleteExpense(exp._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
