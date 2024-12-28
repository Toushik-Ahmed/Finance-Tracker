import {
  Budget,
  deleteBudget,
  editBudget,
  getAllBudgets,
  postBudget,
} from '@/apiServices/budget';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InitialState {
  budget: Budget[];
}

const initialState: InitialState = {
  budget: [],
};

export const postBudgetData = createAsyncThunk(
  'bidget',
  async (data: Budget) => {
    const response = await postBudget(data);
    return response;
  }
);
export const getAllBudgetsData = createAsyncThunk(
  'budgets',
  async (userId: string) => {
    const response = await getAllBudgets(userId);
    return response;
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async (data: Budget) => {
    const response = await editBudget(data);
    return response;
  }
);

export const deleteBudgetData = createAsyncThunk(
  'budgets/delete',
  async (id: string) => {
    const response = await deleteBudget(id);
    return id;
  }
);

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postBudgetData.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        state.budget.push(action.payload);
      }
    );
    builder.addCase(
      getAllBudgetsData.fulfilled,
      (state, action: PayloadAction<Budget[]>) => {
        state.budget = action.payload;
      }
    );
    builder.addCase(
      updateBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        const updatedBudget = action.payload;
        const index = state.budget.findIndex(
          (budgets) => budgets.id === updatedBudget.id
        );
        if (index !== -1) {
          state.budget[index] = updatedBudget;
        }
      }
    );
    builder.addCase(
      deleteBudgetData.fulfilled,
      (state, action: PayloadAction<string>) => {
        const deletedId = action.payload;
        if (deletedId) {
          state.budget = state.budget.filter((el) => el.id !== deletedId);
        }
      }
    );
  },
});
