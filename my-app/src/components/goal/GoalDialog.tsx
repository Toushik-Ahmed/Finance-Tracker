'use clent';
import { Budget } from '@/apiServices/budget';
import { useToast } from '@/hooks/use-toast';
import { Goal, postGoalData, updateGoalData } from '@/redux/features/goalSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Selector from '../customComponents/Selector';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type Props = {
  currentUser?: User | null;
  title?: string | React.ReactNode;
  budgets?: Budget;
  variant?: string;
  setCurrentMonth?: (month: string) => void;
  goal?: Goal;
};

const GoalDialog = ({
  budgets,
  currentUser,
  setCurrentMonth,
  goal,
  title,
  variant,
}: Props) => {
  const [category, setCategory] = useState(goal?.category || '');
  const [amount, setAmount] = useState(goal?.amount || '');
  const [month, setMonth] = useState(goal?.month || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const allGoals = useSelector((state: RootState) => state.goal.goals);

  const isCategoryExists = (categoryName: string, selectedMonth: string) => {
    return allGoals.some(
      (goal) =>
        goal.category.toLowerCase() === categoryName.toLowerCase() &&
        goal.month === selectedMonth &&
        goal.userId === currentUser?.id
    );
  };

  const isCategoryExitsForUpdate = (
    categoryName: string,
    selectedMonth: string
  ) => {
    const inputFiledsCategory = allGoals.filter(
      (cat) => cat.category.toLowerCase() !== categoryName.toLowerCase()
    );
    return inputFiledsCategory.some(
      (goal) =>
        goal.category.toLowerCase() === categoryName.toLowerCase() &&
        goal.month === selectedMonth &&
        goal.userId === currentUser?.id
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      id: goal?.id,
      category,
      month,
      amount,
      description,
      userId: currentUser?.id,
    };

    if (goal) {
      // Get all goals for the current month, excluding the current goal
      const existingGoals = allGoals.filter(
        (g) => g.month === month && g.id !== goal.id
      );

      // Check if the new category already exists for the month (case-sensitive)
      const existingCategory = existingGoals.find(
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

      dispatch(updateGoalData(data));
      toast.toast({
        title: 'Goal updated successfully',
        description: `Updated ${amount} to ${category}`,
      });
      setOpen(false);
    } else {
      // For new budget, check if category exists (case-sensitive)
      if (isCategoryExists(category, month)) {
        toast.toast({
          variant: 'destructive',
          title: 'Goal already exists',
          description: `A goal for ${category} already exists for ${month}`,
        });
        return;
      }
      if (!month) {
        toast.toast({
          variant: 'destructive',
          title: 'Please select a month',
          description: `Please select a month`,
        });
        return;
      }

      dispatch(postGoalData(data));
      setCurrentMonth?.(month);
      setCategory('');
      setAmount('');
      setDescription('');
      toast.toast({
        title: 'Goal created successfully',
        description: `Created ${amount} to ${category}`,
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
                <span>Add target to a plan</span>
              ) : (
                <span>Update Goal</span>
              )}{' '}
            </DialogTitle>
            <DialogDescription>
              <form action="" onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount">Plan</Label>
                      <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter plan name"
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount">Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="Write a short description"
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

export default GoalDialog;
