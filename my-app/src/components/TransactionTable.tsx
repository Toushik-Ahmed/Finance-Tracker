'use client';
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
import { getAllBudgetsData } from '@/redux/features/BudgetSlice';
import { getAllIncomesData } from '@/redux/features/IncomeSlice';
import {
  deleteTransactionFunc,
  getAllTransactions,
} from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDebounce } from '@/redux/utils/debounce';
import { format, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { DateRange } from 'react-day-picker';
import { CiEdit } from 'react-icons/ci';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerWithRange } from './customComponents/DateRange';
import Selector from './customComponents/Selector';
import { DialogDemo } from './Dialogue';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {};

const TransactionTable = (props: Props) => {
  const values = ['Expense', 'Income'];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [monthWiseExpenseCategories, setMonthWiseExpenseCategories] = useState<{
    [key: string]: string[];
  }>({});
  const [monthWiseIncomeCategories, setMonthWiseIncomeCategories] = useState<{
    [key: string]: string[];
  }>({});

  const dispatch = useDispatch<AppDispatch>();

  const [currentMonth, setCurrentMonth] = useState<string>(() =>
    format(new Date(), 'MMMM')
  );
  const [filteredTransactions, seFilteredTransactions] = useState<any[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem('user');
    if (getLoggedInUser) {
      setCurrentUser(JSON.parse(getLoggedInUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getAllTransactions(currentUser.id));
      dispatch(getAllBudgetsData(currentUser.id));
      dispatch(getAllIncomesData(currentUser.id));
    }
  }, [currentUser, dispatch]);

  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );
  const allBudgets = useSelector((state: RootState) => state.budget.budget);

  useEffect(() => {
    const allExpenseCategoriesForMonth = allBudgets.reduce<{
      [key: string]: string[];
    }>((acc, cur) => {
      const currentMonth = cur.month;
      const existingValue = acc[currentMonth] || [];
      return { ...acc, [currentMonth]: [...existingValue, cur.category] };
    }, {});
    setMonthWiseExpenseCategories(allExpenseCategoriesForMonth);
  }, [allBudgets]);

  const currentMonthsBudget = allBudgets.filter((budget) => {
    const budgetMonth = budget.month;
    return budgetMonth === currentMonth;
  });

  const cuurentMonthsBudgetCategories = Array.from(
    new Set(currentMonthsBudget.map((budget) => budget.category))
  );

  console.log('currentMonthsBudgetCategories', cuurentMonthsBudgetCategories);

  const allIncomes = useSelector((state: RootState) => state.income.income);

  useEffect(() => {
    const allIncomeCategoriesForMonth = allIncomes.reduce<{
      [key: string]: string[];
    }>((acc, cur) => {
      // if (!cur || !cur.date) return acc;
      const currentMonth = cur.month;
      const existingValue = acc[currentMonth] || [];
      return { ...acc, [currentMonth]: [...existingValue, cur.category] };
    }, {});
    setMonthWiseIncomeCategories(allIncomeCategoriesForMonth);
  }, [allIncomes]);

  const currentMonthsIncomes = allIncomes.filter((income) => {
    const incomeMonth = income.month;
    return incomeMonth === currentMonth;
  });

  const currentMonthsIncomesCategories = Array.from(
    new Set(currentMonthsIncomes.map((income) => income.category))
  );

  console.log('currentMonthsIncomesCategories', currentMonthsIncomesCategories);

  const categories = Array.from(
    new Set(allTransactions.map((transaction) => transaction.category))
  );

  const allIncomeCategories = Array.from(
    new Set(allIncomes.map((income) => income.category))
  );

  const allExpenseCategories = Array.from(
    new Set(allBudgets.map((budget) => budget.category))
  );

  console.log('allExpenseCategories', allExpenseCategories);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const headers = [
    { label: 'Type', key: 'type' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
  ];

  const csvData = allTransactions.map((transaction) => ({
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date
      ? format(new Date(transaction.date), 'MM/dd/yyyy')
      : '',
    description: transaction.description,
  }));

  const handleReset = () => {
    setSelectedType('');
    setSelectedCategory('');
    setSearchTerm('');
    setDateRange(undefined);
  };

  useEffect(() => {
    const filtered = allTransactions.filter((transaction) => {
      const matchesType = selectedType
        ? transaction.type === selectedType
        : true;
      const matchesCategory = selectedCategory
        ? transaction.category === selectedCategory
        : true;
      const matchesSearchTerm = debouncedSearchTerm
        ? transaction.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          transaction.category
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(debouncedSearchTerm)
        : true;

      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const transactionDate = new Date(transaction.date!);
        matchesDateRange = isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }

      return (
        matchesType && matchesCategory && matchesSearchTerm && matchesDateRange
      );
    });

    seFilteredTransactions(filtered);
  }, [
    debouncedSearchTerm,
    selectedType,
    selectedCategory,
    dateRange,
    allTransactions,
  ]);

  const totalExpense = filteredTransactions.reduce((total, transaction) => {
    if (transaction.type === 'Expense') {
      return total + Number(transaction.amount);
    }
    return total;
  }, 0);

  const totalIncome = filteredTransactions.reduce((total, transaction) => {
    if (transaction.type === 'Income') {
      return total + Number(transaction.amount);
    }
    return total;
  }, 0);

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className=" grid grid-cols-11 gap-4">
        <div className="col-span-2">
          <Selector
            placeholder="Filter by Type"
            value={values}
            onSelect={(value) => setSelectedType(value)}
            selectedValue={selectedType}
          />
        </div>
        <div className="col-span-2">
          <Selector
            placeholder="Filter by Category"
            value={categories}
            onSelect={(value) => setSelectedCategory(value)}
            selectedValue={selectedCategory}
          />
        </div>
        <DatePickerWithRange
          date={dateRange}
          onDateChange={handleDateRangeChange}
          className="col-span-2"
        />
        <Input
          placeholder="Search"
          onChange={handleSearch}
          value={searchTerm}
          className="col-span-2"
        />
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <Button onClick={() => handleReset()} className="">
            Reset
          </Button>

          <DialogDemo
            title="Add"
            allExpenseCategories={cuurentMonthsBudgetCategories}
            allIncomeCategories={currentMonthsIncomesCategories}
            variant="default"
            monthWiseExpenseCategories={monthWiseExpenseCategories}
            monthWiseIncomeCategories={monthWiseIncomeCategories}
          />

          <Button>
            <CSVLink
              data={csvData}
              headers={headers}
              filename={`transactions.csv`}
              className="btn btn-primary"
            >
              Export  CSV
            </CSVLink>
          </Button>
        </div>
      </div>

      <div className="w-full mt-10">
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    {transaction.date
                      ? format(new Date(transaction.date), 'MM/dd/yyyy')
                      : ''}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <DialogDemo
                      title={<CiEdit />}
                      transactionToEdit={transaction}
                      allExpenseCategories={allExpenseCategories}
                      allIncomeCategories={allIncomeCategories}
                      variant="ghost"
                      monthWiseExpenseCategories={monthWiseExpenseCategories}
                      monthWiseIncomeCategories={monthWiseIncomeCategories}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        dispatch(deleteTransactionFunc(transaction.id!))
                      }
                      variant="ghost"
                    >
                      <FcDeleteDatabase />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-slate-200">
            <TableRow>
              <TableCell colSpan={2}>Total-Income</TableCell>
              <TableCell className="text-green-500">${totalIncome}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total-Expense</TableCell>
              <TableCell className="text-red-500">${totalExpense}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
