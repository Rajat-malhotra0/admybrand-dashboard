"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Target,
  CreditCard,
  Users,
  Settings,
  UserCheck,
  Crown,
  Shield,
  Database,
} from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";
import DownloadPDFButton from "@/components/DownloadPDFButton";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  reportRef?: React.RefObject<HTMLDivElement>;
  platform?: string;
  country?: string | null;
  disabled?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", reportRef, platform, country, disabled = false }) => {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      href: "/",
      icon: Home,
      label: "Dashboard",
      description: "Main overview"
    },
    {
      href: "/campaigns",
      icon: Target,
      label: "Campaigns",
      description: "Manage campaigns"
    },
    {
      href: "/payments",
      icon: CreditCard,
      label: "Payments",
      description: "Financial management"
    },
    {
      href: "/influencers",
      icon: UserCheck,
      label: "Influencers",
      description: "Influencer management"
    },
    {
      href: "/team",
      icon: Users,
      label: "Team",
      description: "Team management"
    },
    {
      href: "/admin",
      icon: Shield,
      label: "Admin",
      description: "Admin panel"
    },
    {
      href: "/data-editor",
      icon: Database,
      label: "Data Editor",
      description: "Edit dashboard data"
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      description: "App settings"
    }
  ];
  
  return (
    <div className={`flex flex-col bg-bg-sidebar text-text-white h-full w-full ${className}`}>
      {/* User Profile Section */}
      <div className="px-3 lg:px-4 py-4 lg:py-6 border-b border-border">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs lg:text-sm">
            JL
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate text-sm lg:text-base">
              Justinus Lhaksana
            </p>
            <p className="text-slate-400 truncate text-xs lg:text-sm">
              @justinus.lhaksana
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-3 lg:px-4 pb-3 lg:pb-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  w-full text-left flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                `}
                title={item.description}
              >
                <Icon className="flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
                )}
              </Link>
            );
          })}
          
          {/* Download PDF Button */}
          {reportRef && platform && (
            <DownloadPDFButton
              reportRef={reportRef}
              platform={platform}
              country={country || null}
              disabled={disabled}
            />
          )}
        </nav>
      </div>

      {/* Pro Access Card */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-3 lg:p-4">
          <div className="flex items-center space-x-1.5 lg:space-x-2 mb-2">
            <Crown className="flex-shrink-0 text-yellow-300 w-4 h-4 lg:w-5 lg:h-5" />
            <span className="font-semibold text-xs lg:text-sm">
              Become Pro Access
            </span>
          </div>
          <p className="text-blue-100 mb-2 lg:mb-3 leading-relaxed text-xs">
            Try our knowledge base and unlock learning
          </p>
          <button className="w-full bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors py-1.5 px-2 lg:py-2 lg:px-3 text-xs lg:text-sm">
            Upgrade Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
