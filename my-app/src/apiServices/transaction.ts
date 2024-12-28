import { Transaction } from '@/redux/features/transactionSlice';
import axios from 'axios';

 export  const postTransaction = async (data: Transaction) => {
  const response = await axios.post(
    'http://localhost:5000/transaction',
    data
  );
  return response.data;
};

export const getAllTransactionById= async (id: string) => {
  const response = await axios.get(
    `http://localhost:5000/transaction?userId=${id}`
  );
  return response.data;
};

export const editTransaction = async (data: Transaction) => {
  const response = await axios.put(
    `http://localhost:5000/transaction/${data.id}`,
    data
  );
  return response.data;
};
export const deleteTransaction = async (id: string) => {
  const response = await axios.delete(
    `http://localhost:5000/transaction/${id}`
  );
  return response.data;
};