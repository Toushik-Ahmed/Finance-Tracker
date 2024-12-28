'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { postSignUp } from '@/redux/features/userSlice';
import { AppDispatch } from '@/redux/store';


type Props = {};

const Signup = (props: Props) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = dispatch(postSignUp(user));
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
        router.push('/login');
      }
      console.log('signup successful:', user);
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <div className="w-[400px] bg-slate-100 border-gray-500 rounded-lg shadow-md p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Label className="font-bold">User Name:</Label>
        <Input
        required
          name="username"
          value={user.username}
          onChange={handleChange}
          type="text"
          placeholder="Enter user name"
        ></Input>
        <label className="font-bold">Email:</label>
        <Input
        required
          name="email"
          value={user.email}
          onChange={handleChange}
          type="text"
          placeholder="Enter email"
        ></Input>
        <Label className="font-bold">Password:</Label>
        <Input
        required
          name="password"
          value={user.password}
          onChange={handleChange}
          type="password"
          placeholder="Enter password"
        ></Input>
        <Button type="submit" className="w-full">
          Signup
        </Button>
      </form>
      <div className="mt-4 w-full">
        <div className="flex justify-center gap-2 mt-2">
          <p>Already have an account? </p>
          <Link href="/login">
            <p className="font-bold">Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
