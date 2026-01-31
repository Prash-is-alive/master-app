"use client"

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import UserMenu from './UserMenu';

// Module title mapping
const moduleTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Master App' },
  '/gym-log': { title: 'Gym Logger', subtitle: 'Track your progress' },
  '/login': { title: 'Master App' },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => 
        cookie.trim().startsWith('auth_token=')
      );
      
      if (authCookie) {
        const tokenValue = authCookie.split('=')[1]?.trim();
        setIsLoggedIn(tokenValue === 'valid_token');
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    };

    checkAuth();
    // Check periodically in case cookie changes
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, [pathname]);

  // Fetch username when logged in
  useEffect(() => {
    if (isLoggedIn && !username) {
      const fetchUsername = async () => {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setUsername(data.user?.username || null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUsername();
    } else if (!isLoggedIn) {
      setUsername(null);
    }
  }, [isLoggedIn, username]);


  const handleHome = () => {
    router.push('/');
  };

  const isHomePage = pathname === '/';

  // Get title and subtitle based on current path
  const { title, subtitle } = moduleTitles[pathname] || { title: 'Master App' };

  // Don't show navbar on login page if not logged in
  if (pathname === '/login' && !isLoggedIn) {
    return null;
  }

  return (
    <header className="bg-black border-b border-[#333333] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Title & Navigation */}
          <div className="flex items-center gap-4">
            {isLoggedIn && !isHomePage && (
              <button
                onClick={handleHome}
                className="p-2 text-gray-400 hover:text-[#ededed] hover:bg-[#111111] rounded-lg transition-colors"
                aria-label="Go to home"
              >
                <Home size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-[#ededed] leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - User Menu */}
          {isLoggedIn && username && (
            <UserMenu username={username} />
          )}
        </div>
      </div>
    </header>
  );
}
