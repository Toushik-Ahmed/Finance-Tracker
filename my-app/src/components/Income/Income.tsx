'use client';
import {
  deleteIncomeData,
  getAllIncomesData,
} from '@/redux/features/IncomeSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { getLoggedInUser, User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IncomeTable from './IncomeTable';

type Props = {};

const Income = (props: Props) => {
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
        dispatch(getAllIncomesData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
      }
    };
    fetchAllIncomes();
  }, [currentUser, dispatch]);

  const incomes = useSelector((state: RootState) => state.income.income);
  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  const handleDelete = (id: string) => {
    dispatch(deleteIncomeData(id));
  };

  // Fixed income calculation
  const incomeByCategory: Record<string, number> = {};

  // First, initialize all income categories with 0
  incomes
    .filter((income) => income.month === currentMonth)
    .forEach((income) => {
      incomeByCategory[income.category] = 0;
    });

  // Then sum up all matching transactions
  transactions
    .filter((transaction) => {
      return (
        transaction.type?.toLowerCase() === 'income' && // Case-insensitive comparison
        transaction.date &&
        format(new Date(transaction.date), 'MMMM') === currentMonth
      );
    })
    .forEach((transaction) => {
      if (incomeByCategory.hasOwnProperty(transaction.category)) {
        incomeByCategory[transaction.category] += parseFloat(
          transaction.amount
        );
      }
    });

  // Add console.log for debugging
  console.log('Current Month:', currentMonth);
  console.log('Transactions:', transactions);
  console.log('Income By Category:', incomeByCategory);

  return (
    <div>
      <div className="text-center my-12 font-bold text-4xl">
        Income Information
      </div>
      <div className="flex justify-center">
        <IncomeTable
          currentUser={currentUser}
          incomes={incomes}
          incomeByCategory={incomeByCategory}
          handleDelete={handleDelete}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </div>
    </div>
  );
};

export default Income;
