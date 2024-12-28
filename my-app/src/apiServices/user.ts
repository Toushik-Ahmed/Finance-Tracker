import axios from 'axios';

export interface User {
  username: string;
  password: string;
  email: string;
}

export const signUp = async (data: User) => {
  const userData = await axios.post('http://localhost:5000/user', data);
  return userData.data;
};

export const login = async (data: Partial<User>) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/user?email=' + data.email
    );
    const user = response.data[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== data.password) {
      throw new Error('Invalid email or password');
    }

    return  user ;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
