'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  editTransactionFunc,
  postTransactionFunc,
  Transaction,
} from '@/redux/features/transactionSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from './customComponents/DatePicker';
import Selector from './customComponents/Selector';
import { Textarea } from './ui/textarea';

import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Props = {
  title: string | React.ReactNode;
  // filteredTransactions?: Transaction[];
  transactionToEdit?: Transaction;
  allIncomeCategories: string[];
  allExpenseCategories: string[];
  variant?: string;
  monthWiseExpenseCategories?: {
    [key: string]: string[];
  };
  monthWiseIncomeCategories?: {
    [key: string]: string[];
  };
};

export function DialogDemo({
  title,
  // filteredTransactions,
  transactionToEdit,
  allIncomeCategories,
  allExpenseCategories,
  variant,
  monthWiseExpenseCategories,
  monthWiseIncomeCategories,
}: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [type, setType] = useState<string>(transactionToEdit?.type || '');
  const [category, setCategory] = useState(transactionToEdit?.category || '');
  const [amount, setAmount] = useState(transactionToEdit?.amount || '');
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(
    transactionToEdit?.date ? new Date(transactionToEdit.date) : new Date()
  );
  const [description, setDescription] = useState(
    transactionToEdit?.description || ''
  );
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();

  const changeCategoryList = (date: Date) => {
    const currentMonth = format(date, 'MMMM');
    const currentList =
      type === 'Expense'
        ? monthWiseExpenseCategories?.[currentMonth]
        : monthWiseIncomeCategories?.[currentMonth];

    setCategoryList(currentList || []);
  };

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem('user');
    if (getLoggedInUser) {
      setCurrentUser(JSON.parse(getLoggedInUser));
    }
  }, []);

  useEffect(() => {
    changeCategoryList(date);
  }, [monthWiseExpenseCategories, monthWiseIncomeCategories, type]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transaction = {
      id: transactionToEdit?.id || undefined,
      type,
      category,
      amount,
      date,
      description,
      userId: currentUser?.id,
    };

    if (transactionToEdit) {
      dispatch(editTransactionFunc(transaction));
      setOpen(false);
      toast({
        title: 'Transaction Updated',
        description: 'Your transaction was successfully updated.',
      });

      console.log('Transaction updated:', transaction);
    } else {
      if (!type) {
        toast({
          title: 'Type is required',
          description: 'Please select a type.',
          variant: 'destructive',
        });
        return;
      }

      if (!category) {
        toast({
          title: 'Category is required',
          description: 'Please select a category.',
          variant: 'destructive',
        });
        return;
      }

      dispatch(postTransactionFunc(transaction));
      toast({
        title: 'Transaction Added',
        description: 'Your transaction was successfully added.',
      });
      setType('');
      setCategory('');
      setAmount('');
      setDate(new Date());
      setDescription('');
      console.log('New transaction added:', transaction);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant as 'ghost' | 'default'} className="">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title === 'Add Transaction' ? (
              <span>Add a transaction</span>
            ) : (
              <span>Update transaction</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type">Type</Label>
              <div className="col-span-3 ">
                <Selector
                  placeholder="Type"
                  value={['Expense', 'Income']}
                  selectedValue={type}
                  onSelect={(value: string) => setType(value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type">Category</Label>
              <div className="col-span-3 ">
                <Selector
                  placeholder="Categories"
                  value={categoryList}
                  selectedValue={category}
                  onSelect={(value: string) => setCategory(value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount">Amount</Label>

              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                id="amount"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                date={date}
                disabled={{
                  after: new Date(),
                }}
                setDate={(date) => {
                  setDate(date);
                  changeCategoryList(date);
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 w-full"
                id="description"
                required
              />
            </div>
            <DialogFooter>
              <Button className="w-full" type="submit">
                {transactionToEdit ? 'Update Transaction' : 'Add'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
