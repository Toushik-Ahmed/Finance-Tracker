import { deleteTransaction, editTransaction, getAllTransactionById, postTransaction } from '@/apiServices/transaction';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';

export interface Transaction {
  id?: string;
  type: string;
  category: string;
  amount: string;
  date: Date|undefined;
  description: string;
  userId: string|undefined;
}

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

export const postTransactionFunc = createAsyncThunk(
  'transaction/postTransaction',
  async (data: Transaction) => {
    const response = await postTransaction(data);
    return response;
  }
);

export const getAllTransactions = createAsyncThunk(
  'transaction/getAllTransactionById',
  async (id: string) => {
    const response = await getAllTransactionById(id);
    return response;
  }
);

export const editTransactionFunc = createAsyncThunk(
  'transaction/editTransaction',
  async (data: Transaction) => {
    const response = await editTransaction(data);
    return response;
  }
);

export const deleteTransactionFunc=createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string) => {
    const response = await deleteTransaction(id);
    return response;
  }
);


export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postTransactionFunc.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      }
    );
    builder.addCase(
      getAllTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
      }
    );
    builder.addCase(
      editTransactionFunc.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === updatedTransaction.id
        );
        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }
      }
    );
    builder.addCase(
      deleteTransactionFunc.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        const deletedTransaction = action.payload;
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== deletedTransaction.id
        );
      }
    )
  }
});
