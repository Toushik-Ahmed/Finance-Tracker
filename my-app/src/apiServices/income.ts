import { Income } from '@/redux/features/IncomeSlice';
import axios from 'axios';



export const postIncome = async (income: Income) => {
  const res = await axios.post(`http://localhost:5000/income`, income);
  return res.data;
};

export const getAllIncomes = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/income?userId=${id}`);
  return res.data;
};

export const editIncome = async (data: Income) => {
  const response = await axios.put(
    `http://localhost:5000/income/${data.id}`,
    data
  );
  return response.data;
};

export const deleteIncome = async (id: string) => {
  const response = await axios.delete(`http://localhost:5000/income/${id}`);
  return response.data;
};
