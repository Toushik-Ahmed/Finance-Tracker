import { Budget } from '@/apiServices/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Income } from '@/redux/features/IncomeSlice';
import { Transaction } from '@/redux/features/transactionSlice';
import { format, subDays } from 'date-fns';
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  allTransactions: Transaction[];
  allBudgets: Budget[];
  allIncomeGoals: Income[];
};

const Charts = ({ allTransactions, allBudgets, allIncomeGoals }: Props) => {
  const currentMonthntMonth = format(new Date(), 'MMMM');
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);

  // Existing expense vs budget data preparation
  const expensesByCategory = allTransactions
    .filter(
      (transaction) =>
        transaction.type === 'Expense' &&
        format(new Date(transaction.date!), 'MMMM') === currentMonthntMonth
    )
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const budgetsByCategory = allBudgets
    .filter((budget) => budget.month === currentMonthntMonth)
    .reduce<Record<string, number>>((acc, budget) => {
      acc[budget.category] = parseFloat(budget.amount);
      return acc;
    }, {});

  const expenseVsBudgetData = Object.keys({
    ...expensesByCategory,
    ...budgetsByCategory,
  }).map((category) => ({
    category,
    expense: expensesByCategory[category] || 0,
    budget: budgetsByCategory[category] || 0,
  }));

  // Existing income vs goals data preparation
  const incomeByCategory = allTransactions
    .filter(
      (transaction) =>
        transaction.type === 'Income' &&
        format(new Date(transaction.date!), 'MMMM') === currentMonthntMonth
    )
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const incomeGoalsByCategory = allIncomeGoals
    .filter((income) => income.month === currentMonthntMonth)
    .reduce<Record<string, number>>((acc, goal) => {
      acc[goal.category] = parseFloat(goal.amount);
      return acc;
    }, {});

  const incomeVsGoalsData = Object.keys({
    ...incomeByCategory,
    ...incomeGoalsByCategory,
  }).map((category) => ({
    category,
    income: incomeByCategory[category] || 0,
    goal: incomeGoalsByCategory[category] || 0,
  }));

  //  Last 7 days expenses pie chart data
  const last7DaysExpenses = allTransactions
    .filter(
      (transaction) =>
        transaction.type === 'Expense' &&
        new Date(transaction.date!) >= sevenDaysAgo &&
        new Date(transaction.date!) <= today
    )
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const pieChartData = Object.entries(last7DaysExpenses).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  // New: Last 7 days income line chart data
  const last7DaysIncome = [...Array(7)].map((_, index) => {
    const date = subDays(today, 6 - index);
    const dateStr = format(date, 'MM/dd');
    const amount = allTransactions
      .filter(
        (transaction) =>
          transaction.type === 'Income' &&
          format(new Date(transaction.date!), 'MM/dd') === dateStr
      )
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    return {
      date: dateStr,
      amount,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm">
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  // Generate different shades of blue (#2563eb)
  const generateBlueShades = (index: number, total: number) => {
    const baseColor = {
      r: 37, // Red value from #2563eb
      g: 99, // Green value from #2563eb
      b: 235, // Blue value from #2563eb
    };

    // Adjust the brightness for each slice
    const brightness = 0.5 + (index / total) * 0.5;

    return `rgb(${Math.round(baseColor.r * brightness)},
                 ${Math.round(baseColor.g * brightness)},
                 ${Math.round(baseColor.b * brightness)})`;
  };

  return (
    <>
      {/* Expense vs Budget Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentMonthntMonth}'s Expense vs Budget by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseVsBudgetData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  stroke="#888888"
                />
                <YAxis stroke="#888888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                <Bar dataKey="budget" fill="" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Income vs Goals Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentMonthntMonth}'s Income vs Goal by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeVsGoalsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  stroke="#888888"
                />
                <YAxis stroke="#888888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#ef4444" name="Income" />
                <Bar dataKey="goal" fill="" name="Goal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#2563eb"
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={generateBlueShades(index, pieChartData.length)}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* New: Last 7 Days Income Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Income Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={last7DaysIncome}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="date" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#000000"
                  strokeWidth={2}
                  name="Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Charts;
