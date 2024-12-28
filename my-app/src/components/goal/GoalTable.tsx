'use client';
import { Budget } from '@/apiServices/budget';
import { getAllBudgetsData } from '@/redux/features/BudgetSlice';
import { deleteGoalData, Goal } from '@/redux/features/goalSlice';
import {
  getAllTransactions,
  Transaction,
} from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import Selector from '../customComponents/Selector';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import GoalDialog from './GoalDialog';

type Props = {
  currentUser: User | null;
  goals: Goal[];
  budgets: Budget[];
  transactions: Transaction[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
};

const GoalTable = ({
  currentMonth,
  currentUser,
  transactions,
  setCurrentMonth,
  budgets,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const allGoals = useSelector((state: RootState) => state.goal.goals);

  useEffect(() => {
    const fetchAllBudgets = async () => {
      if (currentUser && currentUser.id) {
        dispatch(getAllBudgetsData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
      }
    };
    fetchAllBudgets();
  }, [currentUser, dispatch]);

  const selectedMonthsGoals = allGoals.filter(
    (goal) => goal.month === currentMonth
  );

  const handleMonthChange = (selectedMonth: string) => {
    setCurrentMonth(selectedMonth);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteGoalData(id));
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonthsBudgets = budgets.filter((budget) => {
    const budgetMonth = budget.month;
    return budgetMonth === currentMonth;
  });

  const currentMonthsTotalBUudget = currentMonthsBudgets.reduce((acc, cur) => {
    return acc + parseInt(cur.amount);
  }, 0);

  console.log(currentMonthsTotalBUudget);

  const currentMonthsTotalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === 'Expense' &&
        format(new Date(transaction.date!), 'MMMM') === currentMonth
    )
    .reduce((acc, cur) => {
      return acc + parseInt(cur.amount);
    }, 0);

  console.log(currentMonthsTotalExpense);

  const savings = currentMonthsTotalBUudget - currentMonthsTotalExpense;

  return (
    <div className="w-[50vw] mt-10">
      <h1 className="font-bold text-xl mb-4">{currentMonth}'s Goals</h1>
      <div className="flex justify-end gap-4 mr-5 mb-4">
        <div className="flex gap-4">
          <Selector
            value={months}
            placeholder="Select Month"
            selectedValue={currentMonth}
            onSelect={handleMonthChange}
          />
          <Button onClick={() => setCurrentMonth(format(new Date(), 'MMMM'))}>
            Reset
          </Button>
        </div>

        <GoalDialog
          currentUser={currentUser}
          title="Add"
          variant="default"
          setCurrentMonth={setCurrentMonth}
        />
      </div>
      <Table className="justify-center">
        <TableCaption>Your monthly goals.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Goal</TableHead>
            <TableHead>Savings</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Description</TableHead>

            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedMonthsGoals.map((val, ind) => (
            <TableRow key={ind}>
              <TableCell>{val.category}</TableCell>
              <TableCell>${savings}</TableCell>
              <TableCell>${val.amount}</TableCell>
              <TableCell>{val.description}</TableCell>
              <TableCell>
                <GoalDialog
                  title={<CiEdit />}
                  goal={val}
                  currentUser={currentUser}
                  variant="ghost"
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(val.id!)} variant="ghost">
                  <FcDeleteDatabase />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GoalTable;
