'use client';
import { getAllBudgetsData } from '@/redux/features/BudgetSlice';
import { getAllGoalsData } from '@/redux/features/goalSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { getLoggedInUser, User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoalTable from './GoalTable';

type Props = {};

const Goals = (props: Props) => {
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
    const fetchAllIncomes = async () => {
      if (currentUser && currentUser.id) {
        dispatch(getAllBudgetsData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
        dispatch(getAllGoalsData(currentUser.id));
      }
    };
    fetchAllIncomes();
  }, [currentUser, dispatch]);

  const goals = useSelector((state: RootState) => state.goal.goals);
  const budgets = useSelector((state: RootState) => state.budget.budget);
  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );
  // const expenseByCategory: Record<string, number> = {};
  // transactions
  //   .filter((el) => {
  //     return (
  //       el.type === 'Expense' &&
  //       el.date &&
  //       format(new Date(el.date), 'MMMM') === currentMonth
  //     );
  //   })
  //   .forEach((el) => {
  //     expenseByCategory[el.category] =
  //       (expenseByCategory[el.category] ?? 0) + parseFloat(el.amount);
  //   });

  return (
    <div>
      <div className="text-center my-12 font-bold text-4xl">
        Goal Information
      </div>
      <div className="flex justify-center">
        <GoalTable
          goals={goals}
          currentMonth={currentMonth}
          currentUser={currentUser}
          transactions={transactions}
          setCurrentMonth={setCurrentMonth}
          budgets={budgets}
        />
      </div>
    </div>
  );
};

export default Goals;
