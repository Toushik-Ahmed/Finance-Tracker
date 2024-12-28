import {
  deleteIncome,
  editIncome,
  getAllIncomes,
  postIncome,
} from '@/apiServices/income';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Income {
  id?: string;

  amount: string;
  month: string;
  category: string;
  userId?: string;
}

export interface InitialState {
  income: Income[];
}

const initialState: InitialState = {
  income: [],
};

export const postIncomeData = createAsyncThunk(
  'income',
  async (data: Income) => {
    const response = await postIncome(data);
    return response;
  }
);

export const getAllIncomesData = createAsyncThunk(
  'incomes',
  async (userId: string) => {
    const response = await getAllIncomes(userId);
    return response;
  }
);

export const updateIncome = createAsyncThunk(
  'incomes/update',
  async (data: Income) => {
    const response = await editIncome(data);
    return response;
  }
);

export const deleteIncomeData = createAsyncThunk(
  'incomes/delete',
  async (id: string) => {
    const response = await deleteIncome(id);
    return id;
  }
);

export const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postIncomeData.fulfilled,
      (state, action: PayloadAction<Income>) => {
        state.income.push(action.payload);
      }
    );
    builder.addCase(
      getAllIncomesData.fulfilled,
      (state, action: PayloadAction<Income[]>) => {
        state.income = action.payload;
      }
    );

    builder.addCase(
      updateIncome.fulfilled,
      (state, action: PayloadAction<Income>) => {
        const index = state.income.findIndex(
          (income) => income.id === action.payload.id
        );
        if (index !== -1) {
          state.income[index] = action.payload;
        }
      }
    );
    builder.addCase(
      deleteIncomeData.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.income = state.income.filter(
          (income) => income.id !== action.payload
        );
      }
    );
  },
});
