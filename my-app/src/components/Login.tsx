'use client';
import { postLogIn } from '@/redux/features/userSlice';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const dispacth = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispacth(postLogIn(user)).unwrap();
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }

      router.push('/homepage');
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="w-[400px] bg-slate-100 border-gray-500 rounded-lg shadow-md p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Label className="font-bold">Email:</Label>
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
          Login
        </Button>
      </form>
      <div className="mt-4 w-full">
        <div className="flex justify-center gap-2 mt-2">
          <p>Don't have an account? </p>
          <Link href="/">
            <p className="font-bold">Sign Up</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
