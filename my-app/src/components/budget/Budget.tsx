'use client';
import {
  deleteBudgetData,
  getAllBudgetsData,
} from '@/redux/features/BudgetSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { getLoggedInUser, User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetTable from './BudgetTable';

type Props = {};

const Budget = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), 'MMMM')
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await dispatch(getLoggedInUser());
      setCurrentUser(res.payload);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchAllBudgets = async () => {
      if (currentUser && currentUser.id) {
        dispatch(getAllBudgetsData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
      }
    };
    fetchAllBudgets();
  }, [currentUser, dispatch]);

  const budgets = useSelector((state: RootState) => state.budget.budget);
  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  const handleDelete = (id: string) => {
    dispatch(deleteBudgetData(id));
  };

  // Filter expenses by current month
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((el) => {
      return (
        el.type === 'Expense' &&
        el.date &&
        format(new Date(el.date), 'MMMM') === currentMonth
      );
    })
    .forEach((el) => {
      expenseByCategory[el.category] =
        (expenseByCategory[el.category] ?? 0) + parseFloat(el.amount);
    });

  return (
    <div>
      <div className="text-center my-12 font-bold text-4xl">
        Budget Information
      </div>
      <div className="flex justify-center">
        <BudgetTable
          currentUser={currentUser}
          budgets={budgets}
          expenseByCategory={expenseByCategory}
          handleDelete={handleDelete}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </div>
    </div>
  );
};

export default Budget;
