'use client';
import { Budget } from '@/apiServices/budget';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Income } from '@/redux/features/IncomeSlice';
import { Transaction } from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  History,
  Target,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Charts from './Charts';

type Props = {
  allTransactions: Transaction[];
  allBudgets: Budget[];
  allIncomeGoals: Income[];
  currentMonthsTotalExpense: number;
  currentMonthsTotalIncome: number;
};

const Dashboard = ({
  allTransactions,
  allBudgets,
  allIncomeGoals,
  currentMonthsTotalExpense,
  currentMonthsTotalIncome,
}: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem('user');
    if (getLoggedInUser) {
      setCurrentUser(JSON.parse(getLoggedInUser));
    }
  }, []);

  const currentMonthsTotalBudget = allBudgets
    .filter((budget) => budget.month === 'November')
    .reduce((total, budget) => total + parseFloat(budget.amount), 0);

  const totalIncomeGoals = allIncomeGoals.reduce(
    (total, goal) => total + parseFloat(goal.amount),
    0
  );

  const previousMonthData = {
    totalBudget: 28000,
    totalExpense: 22500,
    totalIncome: 25000,
    incomeGoals: 30000,
    expensiveCategories: [
      { category: 'rent', amount: 4000 },
      { category: 'groceries', amount: 2500 },
      { category: 'utilities', amount: 1800 },
    ],
  };

  const expensesByCategory = allTransactions
    .filter((transaction) => transaction.type === 'Expense')
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const incomeByCategory = allTransactions
    .filter((transaction) => transaction.type === 'Income')
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const topExpensiveCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topIncomeCategories = Object.entries(incomeByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const last7Days = allTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date!);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return transactionDate >= sevenDaysAgo;
  });

  const last7DaysExpense = last7Days
    .filter((transaction) => transaction.type === 'Expense')
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const last7DaysIncome = last7Days
    .filter((transaction) => transaction.type === 'Income')
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {currentUser?.username}'s Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Month Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Budget:</span>
              <Badge variant="outline">${currentMonthsTotalBudget}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
                Total Expenses:
              </span>
              <Badge variant="destructive">${currentMonthsTotalExpense}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                Total Income:
              </span>
              <Badge variant="secondary">${currentMonthsTotalIncome}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <Target className="h-4 w-4" />
                Income Goals:
              </span>
              <Badge>${totalIncomeGoals}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Previous Month Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Budget:</span>
              <Badge variant="outline">${previousMonthData.totalBudget}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
                Total Expenses:
              </span>
              <Badge variant="destructive">
                ${previousMonthData.totalExpense}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                Total Income:
              </span>
              <Badge variant="secondary">
                ${previousMonthData.totalIncome}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <Target className="h-4 w-4" />
                Income Goals:
              </span>
              <Badge>${previousMonthData.incomeGoals}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
                Expenses:
              </span>
              <Badge variant="destructive">${last7DaysExpense}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                Income:
              </span>
              <Badge variant="secondary">${last7DaysIncome}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Month Top Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topExpensiveCategories.map(([category, amount], index) => (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm capitalize">{category}:</span>
                  <Badge variant="outline">${amount}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Month Top Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousMonthData.expensiveCategories.map((item) => (
                <div
                  key={item.category}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm capitalize">{item.category}:</span>
                  <Badge variant="outline">${item.amount}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Month Top Incomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIncomeCategories.map(([category, amount], index) => (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm capitalize">{category}:</span>
                  <Badge variant="outline">${amount}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Charts
          allTransactions={allTransactions}
          allBudgets={allBudgets}
          allIncomeGoals={allIncomeGoals}
        />
      </div>
    </div>
  );
};

export default Dashboard;
