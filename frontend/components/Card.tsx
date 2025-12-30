import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        "bg-surface-elevated border border-border/50 rounded-xl shadow-card p-5 md:p-6 w-full h-full",
        hover &&
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
