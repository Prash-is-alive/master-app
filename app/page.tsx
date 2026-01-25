"use client"

import { useRouter } from 'next/navigation';
import { Dumbbell, Activity, LogOut, ArrowRight, Plus, Heart } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/login');
  };

  const modules = [
    {
      id: 'gym-log',
      title: 'Gym Logger',
      description: 'Track workouts, sets, and progress.',
      icon: <Dumbbell size={24} className="text-white" />,
      color: 'bg-blue-600',
      hoverColor: 'group-hover:text-blue-600',
      link: '/gym-log',
      active: true
    },
    {
      id: 'life-log',
      title: 'Life-Logs',
      description: 'My Life in a Shit <3',
      icon: <Heart size={24} className="text-white" />,
      color: 'bg-green-500',
      hoverColor: 'group-hover:text-green-500',
      link: '#',
      active: false
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Master App
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Select a module to get started.</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {modules.map((module) => (
            <div 
              key={module.id}
              onClick={() => module.active && router.push(module.link)}
              className={`
                group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm 
                transition-all duration-300 ease-in-out
                ${module.active 
                  ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed grayscale-[0.5]'
                }
              `}
            >
              {/* Icon Box */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm
                ${module.color} transition-transform group-hover:scale-110
              `}>
                {module.icon}
              </div>

              {/* Text Content */}
              <h3 className={`text-xl font-bold text-gray-900 mb-2 ${module.active ? module.hoverColor : ''} transition-colors`}>
                {module.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {module.description}
              </p>

              {/* Action Indicator */}
              <div className="flex items-center justify-between mt-auto">
                <span className={`
                  text-xs font-bold uppercase tracking-wider 
                  ${module.active ? 'text-gray-400 group-hover:text-gray-900' : 'text-gray-300'}
                `}>
                  {module.active ? 'Open Module' : 'Coming Soon'}
                </span>
                {module.active && (
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-900" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add New Module Placeholder */}
          <button className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-400 hover:border-gray-300 hover:text-gray-500 hover:bg-gray-50/50 transition-all min-h-[240px]">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <span className="font-semibold">Add Module</span>
          </button>

        </div>
      </main>
    </div>
  );
}