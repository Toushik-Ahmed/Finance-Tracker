'use client';
import { useToast } from '@/hooks/use-toast';
import {
  getAllIncomesData,
  Income,
  postIncomeData,
  updateIncome,
} from '@/redux/features/IncomeSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Selector from '../customComponents/Selector';
import { Button } from '../ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  currentUser: User | null;
  title?: string | React.ReactNode;
  income?: Income;
  variant?: string;
  setCurrentMonth?: (month: string) => void;
};

const IncomeDialog = ({
  currentUser,
  income,
  title,
  variant,
  setCurrentMonth,
}: Props) => {
  const [category, setCategory] = useState(income?.category || '');
  const [amount, setAmount] = useState(income?.amount || '');
  const [month, setMonth] = useState(income?.month || '');
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (currentUser && currentUser.id)
      dispatch(getAllIncomesData(currentUser?.id));
  }, []);

  const allIncomes = useSelector((state: RootState) => state.income.income);

  const isCategoryExists = (categoryName: string, selectedMonth: string) => {
    return allIncomes.some(
      (income) =>
        income.category.toLowerCase() === categoryName.toLowerCase() &&
        income.month === selectedMonth &&
        income.userId === currentUser?.id
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(currentUser);

    const data = {
      id: income?.id,
      category,
      amount,
      month,
      userId: currentUser?.id,
    };
    if (income) {
      const existingCategories = allIncomes.filter(
        (g) => g.month === month && g.id !== income.id
      );
      const existingCategory = existingCategories.find(
        (g) => g.category.toLowerCase() === category.toLowerCase()
      );
      if (existingCategory) {
        toast.toast({
          variant: 'destructive',
          title: 'Goal already exists',
          description: `A goal for ${category} already exists for ${month}`,
        });
        return;
      }

      dispatch(updateIncome(data));
      toast.toast({
        title: 'Goal updated successfully',
        description: `Updated ${amount} to ${category}`,
      });
      setOpen(false);
    } else {
      if (isCategoryExists(category, month)) {
        toast.toast({
          variant: 'destructive',
          title: 'Category already exists',
          description: `A goal for ${category} already exists for ${month}`,
        });
        return;
      }
      if (month === '') {
        toast.toast({
          variant: 'destructive',
          title: 'Month is required',
          description: `Please select a month`,
        });
        return;
      }
      dispatch(postIncomeData(data));
      setCurrentMonth?.(month);
      setCategory('');
      setAmount('');

      toast.toast({
        title: 'Goal added successfully',
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
                <span>Add goal to a category</span>
              ) : (
                <span>Update goal to a category</span>
              )}{' '}
            </DialogTitle>
            <DialogDescription>
              <form action="" onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
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

export default IncomeDialog;
