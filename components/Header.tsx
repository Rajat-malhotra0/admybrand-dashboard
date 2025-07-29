import React from 'react';
import { 
  Search, 
  Bell, 
  Circle
} from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6 bg-white border-b border-gray-200 pb-4">
      {/* Left side - Brand/Logo */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">△</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search something"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - User controls */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">J</span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Joxy Inc.</p>
            <div className="flex items-center space-x-1">
              <Circle className="w-2 h-2 text-green-500 fill-current" />
              <span className="text-xs text-gray-500">Brand</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;