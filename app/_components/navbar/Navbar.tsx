"use client"

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Home } from 'lucide-react';

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
      }
    };

    checkAuth();
    // Check periodically in case cookie changes
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsLoggedIn(false);
    router.push('/login');
  };

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isLoggedIn && !isHomePage && (
            <button
              onClick={handleHome}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go to home"
            >
              <Home size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
}
