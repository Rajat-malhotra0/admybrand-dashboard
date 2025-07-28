'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  Crown,
  User,
  Menu,
  X
} from 'lucide-react';

type NavigationItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
};

const NAV_ITEMS: NavigationItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
  { id: 'campaign', icon: Target, label: 'Campaign', active: true },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', active: false },
  { id: 'audience', icon: Users, label: 'Audience', active: false },
  { id: 'settings', icon: Settings, label: 'Settings', active: false },
  { id: 'help', icon: HelpCircle, label: 'Help', active: false },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('campaign');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (id: string) => {
    setActiveItem(id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-bg-sidebar text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative z-40 w-64 bg-bg-sidebar text-white flex flex-col h-screen 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      {/* User Profile */}
      <div className="p-4 md:p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex-shrink-0 flex items-center justify-center">
            <User className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">Sarah Johnson</p>
            <p className="text-sm text-slate-300 truncate">Marketing Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg 
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon 
                    className="w-5 h-5 flex-shrink-0" 
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-white">Upgrade to Pro</span>
          </div>
          <p className="text-sm text-slate-200 mb-3">
            Unlock advanced features and analytics
          </p>
          <button 
            className="w-full bg-white text-primary font-medium py-2 px-4 rounded-md 
                     hover:bg-gray-100 transition-colors duration-200 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => handleNavigation('upgrade')}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;