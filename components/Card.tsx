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
        'tech-card bg-white/95 backdrop-blur-sm border border-border rounded-lg shadow-card ring-1 ring-border/40 p-md md:p-lg',
        hover && 'hover-lift transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-card-hover',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;