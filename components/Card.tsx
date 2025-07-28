import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'tech-card bg-white/95 backdrop-blur-sm border border-slate-100 rounded-lg shadow-sm ring-1 ring-slate-100/40 p-6',
        hover && 'hover-lift transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;