'use client';
import { Budget } from '@/apiServices/budget';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { postBudgetData, updateBudget } from '@/redux/features/BudgetSlice';
import { getAllTransactions } from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Selector from '../customComponents/Selector';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  currentUser?: User | null;
  title?: string | React.ReactNode;
  budgets?: Budget;
  variant?: string;
  setCurrentMonth?: (month: string) => void;
};

const BudgetDialog = ({
  currentUser,
  title,
  budgets,
  variant,
  setCurrentMonth,
}: Props) => {
  const [category, setCategory] = useState(budgets?.category || '');
  const [amount, setAmount] = useState(budgets?.amount || '');
  const [month, setMonth] = useState(budgets?.month || '');
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const allBudgets = useSelector((state: RootState) => state.budget.budget);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (currentUser && currentUser.id)
      dispatch(getAllTransactions(currentUser?.id));
  }, []);

  const isCategoryExists = (categoryName: string, selectedMonth: string) => {
    return allBudgets.some(
      (budget) =>
        budget.category.toLowerCase() === categoryName.toLowerCase() &&
        budget.month === selectedMonth &&
        budget.userId === currentUser?.id
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      id: budgets?.id,
      category,
      month,
      amount,
      userId: currentUser?.id,
    };

    if (budgets) {
      // For updating existing budget
      const existingBudget = allBudgets.filter(
        (g) => g.month === month && g.id !== budgets.id
      );

      const existingCategory = existingBudget.find(
        (g) => g.category.toLowerCase() === category.toLowerCase()
      );
      if (existingCategory) {
        toast.toast({
          variant: 'destructive',
          title: 'Budget already exists',
          description: `A budget for ${category} already exists for ${month}`,
        });
        return;
      }

      dispatch(updateBudget(data));
      toast.toast({
        title: 'Budget updated successfully',
        description: `Updated ${amount} to ${category}`,
      });
      setOpen(false);
    } else {
      // For new budget, check if category exists
      if (isCategoryExists(category, month)) {
        toast.toast({
          variant: 'destructive',
          title: 'Category already exists',
          description: `A budget for ${category} already exists for ${month}`,
        });
        return;
      }
      if (!month) {
        toast.toast({
          variant: 'destructive',
          title: 'Month is required',
          description: `Please select a month`,
        });
        return;
      }

      dispatch(postBudgetData(data));
      setCurrentMonth?.(month);
      setCategory('');
      setAmount('');

      toast.toast({
        title: 'Budget added successfully',
        description: `Added ${amount} to ${category}`,
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={variant as 'ghost' | 'default'} className="">
            {title}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="">
              {title === 'Add' ? (
                <span>Add budget to a category</span>
              ) : (
                <span>Update budget to a category</span>
              )}{' '}
            </DialogTitle>
            <DialogDescription>
              <form action="" onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount">Category</Label>
                      <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter Category"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type">Month</Label>
                    <div className="col-span-3">
                      <Selector
                        placeholder="Month"
                        value={[
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
                        ]}
                        selectedValue={month}
                        onSelect={(value: string) => setMonth(value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter Amount"
                      required
                    />
                  </div>
                </div>
                <Button className="w-full mt-4  bg-black">
                  {title === 'Add' ? <span>Add</span> : <span>Update</span>}
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetDialog;
