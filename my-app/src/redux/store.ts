import { configureStore } from '@reduxjs/toolkit';
import { signUpSlice } from './features/userSlice';
import { transactionSlice } from './features/transactionSlice';
import { budgetSlice } from './features/BudgetSlice';
import { incomeSlice } from './features/IncomeSlice';
import { goalSlice } from './features/goalSlice';

export const store = configureStore({
  reducer: {
    user: signUpSlice.reducer,
    transaction: transactionSlice.reducer,
    budget:budgetSlice.reducer,
    income:incomeSlice.reducer,
    goal:goalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
