'use client';
import Dashboard from '@/components/dashboard/Dashboard';
import { getAllBudgetsData } from '@/redux/features/BudgetSlice';
import { getAllIncomesData } from '@/redux/features/IncomeSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {};

const page = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [currentMonth, setCurrentMonth] = useState<string>(() =>
    format(new Date(), 'MMMM')
  );

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getAllTransactions(currentUser.id));
      dispatch(getAllBudgetsData(currentUser.id));
      dispatch(getAllIncomesData(currentUser.id));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem('user');
    if (getLoggedInUser) {
      setCurrentUser(JSON.parse(getLoggedInUser));
    }
  }, []);

  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  const allBudgets = useSelector((state: RootState) => state.budget.budget);

  const allIncomeGoals = useSelector((state: RootState) => state.income.income);
  console.log('allIncomeGoals', allIncomeGoals);
  console.log('allTransactions', allTransactions);
  console.log('allBudgets', allBudgets);

  const currentMonthsTotalExpense = allTransactions.reduce(
    (total, transaction) =>
      transaction.type === 'Expense'
        ? total + parseFloat(transaction.amount)
        : total,
    0
  );

   const previousMonthsTotalExpense = allTransactions.reduce(
    (total, transaction) =>
      transaction.type === 'Expense' &&
      new Date(transaction.date!).getMonth() ===
        new Date(currentMonth).getMonth() - 1
        ? total + parseFloat(transaction.amount)
        : total,
    0
  );

  console.log('pMonthsTotalExpense', previousMonthsTotalExpense);

  const currentMonthsTotalIncome = allTransactions.reduce(
    (total, transaction) =>
      transaction.type === 'Income'
        ? total + parseFloat(transaction.amount)
        : total,
    0
  );

  const previousMonthsTotalIncome = allTransactions.reduce(
    (total, transaction) =>
      transaction.type === 'Income' &&
      new Date(transaction.date!).getMonth() ===
        new Date(currentMonth).getMonth() - 1
        ? total + parseFloat(transaction.amount)
        : total,
    0
  );

  console.log('pMonthsTotalIncome', previousMonthsTotalIncome);

  return <div className='flex justify-center'>
    <div className='w-[70%]'>
    <Dashboard
    allTransactions={allTransactions}
    allBudgets={allBudgets}
    allIncomeGoals={allIncomeGoals}
    currentMonthsTotalExpense={currentMonthsTotalExpense}
    currentMonthsTotalIncome={currentMonthsTotalIncome}
  />
    </div>
  </div>;
};

export default page;
