import axios from 'axios';

export interface Budget {
  id?: string;

  amount: string;
  month: string;
  category: string;
  userId?: string;
}

export const postBudget = async (budget: Budget) => {
  const res = await axios.post(`http://localhost:5000/budget`, budget);
  return res.data;
};

export const getAllBudgets = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/budget?userId=${id}`);
  return res.data;
};

export const editBudget = async (data: Budget) => {
  const response = await axios.put(
    `http://localhost:5000/budget/${data.id}`,
    data
  );
  return response.data;
};

export const deleteBudget = async (id: string) => {
  const response = await axios.delete(`http://localhost:5000/budget/${id}`);
  return response.data;
};
