"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dumbbell, ArrowRight, Plus, Heart } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  // Check if sysadmin is logged in - redirect to sysadmin page
  useEffect(() => {
    const checkSysadmin = () => {
      const cookies = document.cookie.split(';');
      const hasSysadminAuth = cookies.some(cookie => 
        cookie.trim().startsWith('sysadmin_token=')
      );
      
      if (hasSysadminAuth) {
        router.push('/sysadmin');
      }
    };

    checkSysadmin();
  }, [router]);

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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#ededed]">Welcome Back</h2>
          <p className="text-gray-400 mt-1">Select a module to get started.</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => module.active && router.push(module.link)}
              disabled={!module.active}
              className={`
                group relative bg-[#111111] rounded-2xl p-6 border border-[#333333] 
                transition-all duration-300 ease-in-out text-left
                ${module.active 
                  ? 'hover:bg-[#1a1a1a] hover:border-[#404040] hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  : 'opacity-60 cursor-not-allowed grayscale-[0.5]'
                }
              `}
            >
              {/* Icon Box */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${module.color} transition-transform group-hover:scale-110
              `}>
                {module.icon}
              </div>

              {/* Text Content */}
              <h3 className={`text-xl font-bold text-[#ededed] mb-2 ${module.active ? module.hoverColor : ''} transition-colors`}>
                {module.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {module.description}
              </p>

              {/* Action Indicator */}
              <div className="flex items-center justify-between mt-auto">
                <span className={`
                  text-xs font-bold uppercase tracking-wider 
                  ${module.active ? 'text-gray-500 group-hover:text-[#ededed]' : 'text-gray-600'}
                `}>
                  {module.active ? 'Open Module' : 'Coming Soon'}
                </span>
                {module.active && (
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#262626] transition-colors">
                    <ArrowRight size={16} className="text-gray-500 group-hover:text-[#ededed]" />
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Add New Module Placeholder */}
          <button className="border-2 border-dashed border-[#333333] rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-500 hover:border-[#404040] hover:text-gray-400 hover:bg-[#111111] transition-all min-h-[240px]">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <span className="font-semibold">Add Module</span>
          </button>

        </div>
      </main>
    </div>
  );
}