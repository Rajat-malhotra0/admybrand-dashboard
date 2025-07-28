import React from 'react';
import { format } from 'date-fns';

interface HeaderProps {
  title: string;
  status?: string;
}

const Header: React.FC<HeaderProps> = ({ title, status }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {status && (
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">{status}</span>
          </div>
        )}
      </div>
      <div className="text-sm text-text-muted">
        Last updated: {format(new Date(), 'P')}
      </div>
    </div>
  );
};

export default Header;