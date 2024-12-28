'use client';
import { Budget } from '@/apiServices/budget';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import {
  getAllBudgetsData,
  postBudgetData,
} from '@/redux/features/BudgetSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format, parse, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import Selector from '../customComponents/Selector';
import { Button } from '../ui/button';
import BudegtDialog from './Dialog';

type Props = {
  currentUser: User | null;
  budgets: Budget[];
  expenseByCategory: Record<string, number>;
  handleDelete: (id: string) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
};

const BudgetTable = ({
  currentUser,
  budgets,
  expenseByCategory,
  handleDelete,
  currentMonth,
  setCurrentMonth,
}: Props) => {
  const [previousMonthsBudgetsData, setPreviousMonthsBudgetsData] = useState<
    Budget[]
  >([]);
  const dispatch = useDispatch<AppDispatch>();
  const allbudgets = useSelector((state: RootState) => state.budget.budget);

  useEffect(() => {
    const fetchAllBudgets = async () => {
      if (currentUser && currentUser.id) {
        dispatch(getAllBudgetsData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
      }
    };
    fetchAllBudgets();
  }, [currentUser, dispatch]);

  const selectedMonthBudgets = allbudgets.filter(
    (budget) => budget.month === currentMonth
  );

  const selectedMonthsTotalBudget = selectedMonthBudgets.reduce(
    (total, budget) => total + parseInt(budget.amount),
    0
  );

  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );
  const selectedMonthsTotalExpense = allTransactions
    .filter(
      (tr) =>
        tr.type === 'Expense' &&
        format(new Date(tr.date!), 'MMMM') === currentMonth
    )
    .reduce((total, expense) => total + parseInt(expense.amount), 0);

  console.log('sl', selectedMonthsTotalBudget, selectedMonthsTotalExpense);

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

  const handleMonthChange = (selectedMonth: string) => {
    setCurrentMonth(selectedMonth);
  };

  useEffect(() => {
    const currentDate = parse(currentMonth, 'MMMM', new Date());
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthName = format(previousMonth, 'MMMM');

    const previousMonthsBudgets = allbudgets.filter(
      (budget) => budget.month === previousMonthName
    );
    setPreviousMonthsBudgetsData(previousMonthsBudgets);
  }, [currentMonth, allbudgets]);
  const isCategoryExists = (categoryName: string) => {
    return selectedMonthBudgets.some(
      (budget) =>
        budget.category.toLowerCase() === categoryName.toLowerCase() &&
        budget.userId === currentUser?.id
    );
  };

  const postPreviousMonthBudgets = async () => {
    if (previousMonthsBudgetsData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No previous month budgets found',
      });
      return;
    }

    if (previousMonthsBudgetsData.length > 0) {
      const duplicateCategories: string[] = [];
      const budgetsToAdd: Budget[] = [];

      // Check for duplicate categories first
      previousMonthsBudgetsData.forEach((budget) => {
        if (isCategoryExists(budget.category)) {
          duplicateCategories.push(budget.category);
        } else {
          budgetsToAdd.push(budget);
        }
      });

      // Show warning for duplicate categories if any
      if (duplicateCategories.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Duplicate categories found',
          description: `Categories already exist for ${currentMonth}: ${duplicateCategories.join(
            ', '
          )}`,
        });
      }

      // Post only non-duplicate budgets
      if (budgetsToAdd.length > 0) {
        const promises = budgetsToAdd.map((budget) =>
          dispatch(
            postBudgetData({
              amount: budget.amount,
              month: currentMonth,
              category: budget.category,
              userId: currentUser?.id,
            })
          )
        );

        await Promise.all(promises);

        if (budgetsToAdd.length === previousMonthsBudgetsData.length) {
          toast({
            title: 'Previous month budgets added successfully',
            variant: 'default',
          });
        } else {
          toast({
            title: `Added ${budgetsToAdd.length} of ${previousMonthsBudgetsData.length} budgets`,
            description: 'Some categories were skipped due to duplicates',
            variant: 'default',
          });
        }
      }
    }
  };

  return (
    <div className="w-[50vw] mt-10">
      <h1 className="font-bold text-xl mb-4">{currentMonth}'s budgets</h1>
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

        <BudegtDialog
          currentUser={currentUser}
          title="Add"
          variant="default"
          setCurrentMonth={setCurrentMonth}
        />
        <Button onClick={() => postPreviousMonthBudgets()}>Add Existing</Button>
      </div>
      <Table className="justify-center">
        <TableCaption>Your monthly budgets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Expense</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedMonthBudgets.map((val, ind) => (
            <TableRow key={ind}>
              <TableCell>{val.category}</TableCell>
              <TableCell>${expenseByCategory[val.category] || 0}</TableCell>
              <TableCell>${val.amount}</TableCell>
              <TableCell>
                <BudegtDialog
                  title={<CiEdit />}
                  budgets={val}
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
        <TableFooter className="bg-slate-200">
          <TableRow>
            <TableCell colSpan={2}>Total-Budget</TableCell>
            <TableCell className="text-green-500">
              ${selectedMonthsTotalBudget}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total-Expense</TableCell>
            <TableCell className="text-red-500">
              ${selectedMonthsTotalExpense}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default BudgetTable;
