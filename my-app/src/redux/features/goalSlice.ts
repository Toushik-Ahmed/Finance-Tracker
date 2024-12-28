import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Goal {
  id?: string;
  category: string;
  amount: string;
  month: string;
  description?: string;
  userId?: string;
}

export interface InitialState {
  goals: Goal[];
}

const initialState: InitialState = {
  goals: [],
};
export const postGoalData = createAsyncThunk('goals', async (data: Goal) => {
  const response = await axios.post(`http://localhost:5000/goal`, data);
  return response.data;
});

export const getAllGoalsData = createAsyncThunk(
  'get/goals',
  async (userId: string) => {
    const response = await axios.get(
      `http://localhost:5000/goal?userId=${userId}`
    );
    return response.data;
  }
);

export const deleteGoalData = createAsyncThunk(
  'goals/delete',
  async (id: string) => {
    const response = await axios.delete(`http://localhost:5000/goal/${id}`);
    return id;
  }
);

export const updateGoalData = createAsyncThunk(
  'goals/update',
  async (data: Goal) => {
    const response = await axios.put(
      `http://localhost:5000/goal/${data.id}`,
      data
    );
    return response.data;
  }
);

export const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postGoalData.fulfilled,
      (state, action: PayloadAction<Goal>) => {
        state.goals.push(action.payload);
      }
    );
    builder.addCase(
      getAllGoalsData.fulfilled,
      (state, action: PayloadAction<Goal[]>) => {
        state.goals = action.payload;
      }
    );
    builder.addCase(
      deleteGoalData.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      }
    );
    builder.addCase(
      updateGoalData.fulfilled,
      (state, action: PayloadAction<Goal>) => {
        const index = state.goals.findIndex(
          (goal) => goal.id === action.payload.id
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      }
    );
  },
});
