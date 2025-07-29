"use client";

import React from "react";
import {
  Home,
  Target,
  CreditCard,
  Users,
  Settings,
  UserCheck,
  Crown,
  Search,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

// Reusable UserCard component
const UserCard: React.FC = () => (
  <div className="p-md lg:p-lg border-b border-slate-700">
    <div className="flex items-center space-x-sm md:space-x-md">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-text-white font-semibold text-sm md:text-base">
        JL
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm md:text-base truncate">
          Justinus Lhaksana
        </p>
        <p className="text-xs md:text-sm text-text-muted truncate">
          @justinus.lhaksana
        </p>
      </div>
    </div>
  </div>
);

// Primary Navigation component
const PrimaryNav: React.FC = () => (
  <nav className="mb-md">
    <ul className="space-y-xs">
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md hover:bg-slate-700 transition-colors">
          <Home className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Home</span>
        </button>
      </li>
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md bg-primary transition-colors">
          <Target className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Campaign</span>
        </button>
      </li>
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md hover:bg-slate-700 transition-colors">
          <CreditCard className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Payments</span>
        </button>
      </li>
    </ul>
  </nav>
);

// Secondary Navigation component
const SecondaryNav: React.FC = () => (
  <nav>
    <ul className="space-y-xs">
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md hover:bg-slate-700 transition-colors">
          <UserCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Influencer</span>
        </button>
      </li>
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md hover:bg-slate-700 transition-colors">
          <Settings className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Settings</span>
        </button>
      </li>
      <li>
        <button className="w-full text-left flex items-center space-x-sm md:space-x-md p-sm md:p-md rounded-md hover:bg-slate-700 transition-colors">
          <Users className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-sm md:text-base truncate">Team</span>
        </button>
      </li>
    </ul>
  </nav>
);

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => (
  <div
    className={`flex flex-col bg-bg-sidebar text-text-white h-full w-full ${className}`}
  >
    {/* Top Card */}
    <div>
      <div className="p-md border-b border-slate-700">
        <h1 className="text-lg md:text-xl font-bold">Dashboard</h1>
      </div>
      <UserCard />
    </div>

    {/* Middle Section */}
    <div className="flex-1 flex flex-col p-sm md:p-md">
      {/* Search Input */}
      <div className="mb-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Primary Navigation */}
      <PrimaryNav />

      {/* Secondary Navigation */}
      <SecondaryNav />
    </div>

    {/* Bottom Card */}
    <div className="p-sm md:p-md">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-sm md:p-md text-text-white">
        <div className="flex items-center space-x-xs mb-xs md:mb-sm">
          <Crown className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="font-semibold text-sm md:text-base">
            Become Pro Access
          </span>
        </div>
        <p className="text-xs md:text-sm text-primary-light mb-sm md:mb-md">
          Try our knowledge base and unlock learning
        </p>
        <button className="w-full bg-text-white text-primary font-semibold py-xs md:py-sm px-sm md:px-md rounded-md hover:bg-bg-secondary transition-colors flex items-center justify-center space-x-xs text-sm">
          <Crown className="w-3 h-3 md:w-4 md:h-4" />
          <span>Upgrade Pro</span>
        </button>
      </div>
    </div>
  </div>
);

export default Sidebar;
export { UserCard };
