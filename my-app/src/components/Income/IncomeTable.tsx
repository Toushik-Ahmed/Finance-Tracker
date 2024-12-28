import {
  getAllIncomesData,
  Income,
  postIncomeData,
} from '@/redux/features/IncomeSlice';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import IncomeDialog from './IncomeDialog';

import { toast } from '@/hooks/use-toast';
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

type Props = {
  currentUser: User | null;
  incomes: Income[];
  handleDelete: (id: string) => void;
  incomeByCategory: Record<string, number>;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
};

const IncomeTable = ({
  currentUser,
  handleDelete,
  incomeByCategory,
  incomes,
  currentMonth,
  setCurrentMonth,
}: Props) => {
  const [previousMonthsIncomesData, setPreviousMonthsIncomesData] = useState<
    Income[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchAllBudgets = async () => {
      if (currentUser && currentUser.id) {
        dispatch(getAllIncomesData(currentUser.id));
        dispatch(getAllTransactions(currentUser.id));
      }
    };
    fetchAllBudgets();
  }, [currentUser, dispatch]);

  const allIncomes = useSelector((state: RootState) => state.income.income);
  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  const selectedMonthsIncomes = allIncomes.filter(
    (income) => income.month === currentMonth
  );

  const selectedMonthsTotalGoal = selectedMonthsIncomes.reduce(
    (total, income) => total + parseInt(income.amount),
    0
  );
  const selectedMonthsTotalIncome = allTransactions
    .filter(
      (tr) =>
        tr.type === 'Income' &&
        format(new Date(tr.date!), 'MMMM') === currentMonth
    )
    .reduce((total, income) => total + parseInt(income.amount), 0);

  console.log(selectedMonthsTotalIncome, selectedMonthsTotalGoal);

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

    const previousMonthsIncomes = allIncomes.filter(
      (budget) => budget.month === previousMonthName
    );
    setPreviousMonthsIncomesData(previousMonthsIncomes);
  }, [currentMonth, allIncomes]);
  const isCategoryExists = (categoryName: string) => {
    return selectedMonthsIncomes.some(
      (income) =>
        income.category.toLowerCase() === categoryName.toLowerCase() &&
        income.userId === currentUser?.id
    );
  };

  const postPreviousMonthBudgets = async () => {
    if (previousMonthsIncomesData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No previous month goals found',
      });
      return;
    }

    if (previousMonthsIncomesData.length > 0) {
      const duplicateCategories: string[] = [];
      const budgetsToAdd: Income[] = [];

      // Check for duplicate categories first
      previousMonthsIncomesData.forEach((budget) => {
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
            postIncomeData({
              amount: budget.amount,
              month: currentMonth,
              category: budget.category,
              userId: currentUser?.id,
            })
          )
        );

        await Promise.all(promises);

        if (budgetsToAdd.length === previousMonthsIncomesData.length) {
          toast({
            title: 'Previous month goals added successfully',
            variant: 'default',
          });
        } else {
          toast({
            title: `Added ${budgetsToAdd.length} of ${previousMonthsIncomesData.length} budgets`,
            description: 'Some categories were skipped due to duplicates',
            variant: 'default',
          });
        }
      }
    }
  };

  return (
    <div className="w-[50vw] mt-10">
      <h1 className="font-bold text-xl mb-4">{currentMonth}'s incomes</h1>
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

        <IncomeDialog
          currentUser={currentUser}
          title="Add"
          variant="default"
          setCurrentMonth={setCurrentMonth}
        />

        <Button
          onClick={() => {
            postPreviousMonthBudgets();
          }}
        >
          Add Existing
        </Button>
      </div>

      <Table className=" justify-center">
        <TableCaption>Your monthly Incomes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedMonthsIncomes.map((val, ind) => (
            <TableRow key={ind}>
              <TableCell>{val.category}</TableCell>

              <TableCell>${incomeByCategory[val.category] || 0}</TableCell>
              <TableCell>${val.amount}</TableCell>
              <TableCell>
                <IncomeDialog
                  title={<CiEdit />}
                  income={val}
                  currentUser={currentUser}
                  variant="ghost"
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDelete(val.id!)}>
                  <FcDeleteDatabase />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-slate-200">
          <TableRow>
            <TableCell colSpan={2}>Total-Income</TableCell>
            <TableCell className="text-green-500">
              ${selectedMonthsTotalIncome}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total-Goal</TableCell>
            <TableCell className="text-red-500">
              ${selectedMonthsTotalGoal}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default IncomeTable;
