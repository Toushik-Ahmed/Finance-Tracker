'use client';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function Homepage() {
  const router = useRouter();
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getActivePathClass = (path: string): string => {
    return currentPath === path ? 'text-blue-900 border' : '';
  };

  const routes = [
    { title: 'Dashboard', link: '/homepage' },
    { title: 'Budget', link: '/homepage/budget' },
    { title: 'Income', link: '/homepage/income' },
    { title: 'Transaction', link: '/homepage/transaction' },
    { title: 'Goals', link: '/homepage/goals' },
  ];

  return (
    <nav className="w-full p-4 border-b sticky top-0 bg-white/70 z-50 backdrop-blur-[2px]">
      <div className="max-w-screen-xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex gap-8 font-bold">
            {routes.map((route) => (
              <Link
                key={route.link}
                href={route.link}
                className={cn(
                  getActivePathClass(route.link),
                  'hover:text-blue-700 transition-colors p-2'
                )}
              >
                {route.title}
              </Link>
            ))}
          </div>
          <Button onClick={logout}>Logout</Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <Button onClick={logout} size="sm">
            Logout
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white border-b px-4 py-2 mt-2">
            <div className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.link}
                  href={route.link}
                  className={cn(
                    getActivePathClass(route.link),
                    'hover:text-blue-700 transition-colors p-2 font-bold'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
