import React from 'react';
import { format } from 'date-fns';

interface HeaderProps {
  title: string;
  status?: string;
}

const Header: React.FC<HeaderProps> = ({ title, status }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const utcTime = currentTime.toISOString().split('T')[1].split('.')[0];
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {status && (
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">{status}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end space-y-1">
        <div className="text-sm text-text-muted">
          Last updated: {format(currentTime, 'P')}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-text-muted mono" suppressHydrationWarning>UTC {utcTime}</span>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded mono">v2.4.1</span>
        </div>
      </div>
    </div>
  );
};

export default Header;