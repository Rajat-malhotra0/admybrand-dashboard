"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/hooks/useScreenSize";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  variant?: "dashboard" | "stat-cards" | "charts" | "table";
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = "",
  gap = "md",
  variant = "dashboard",
}) => {
  const { screenSize, isMobile, isTablet, isDesktop } = useScreenSize();

  const getGridClasses = () => {
    const gapClasses = {
      sm: "gap-3 xs:gap-4 sm:gap-4 lg:gap-3",
      md: "gap-4 xs:gap-6 sm:gap-6 lg:gap-6",
      lg: "gap-6 xs:gap-8 sm:gap-8 lg:gap-8",
    };

    const variantClasses = {
      dashboard: `
        grid 
        grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-12
        w-full
        ${gapClasses[gap]}
      `,
      "stat-cards": `
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-2 
        lg:grid-cols-4
        w-full
        ${gapClasses[gap]}
      `,
      charts: `
        grid 
        grid-cols-1 
        sm:grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3
        xl:grid-cols-4
        w-full
        ${gapClasses[gap]}
      `,
      table: `
        grid 
        grid-cols-1
        w-full
        ${gapClasses[gap]}
      `,
    };

    return variantClasses[variant];
  };

  return (
    <div
      className={cn(getGridClasses(), className)}
      data-screen-size={screenSize}
      role="main"
      aria-label={`${variant} responsive grid`}
    >
      {children}
    </div>
  );
};

// Responsive Grid Item component
interface ResponsiveGridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  rowSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  priority?: "high" | "medium" | "low"; // For content prioritization
}

const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  className = "",
  colSpan = {},
  rowSpan = {},
  priority = "medium",
}) => {
  const { isMobile, isTablet } = useScreenSize();

  // Content prioritization - hide low priority items on mobile
  if (isMobile && priority === "low") {
    return null;
  }

  // Build responsive col-span classes
  const colSpanClasses = Object.entries(colSpan)
    .map(([breakpoint, span]) => {
      if (breakpoint === "xs") return `col-span-${span}`;
      return `${breakpoint}:col-span-${span}`;
    })
    .join(" ");

  // Build responsive row-span classes
  const rowSpanClasses = Object.entries(rowSpan)
    .map(([breakpoint, span]) => {
      if (breakpoint === "xs") return `row-span-${span}`;
      return `${breakpoint}:row-span-${span}`;
    })
    .join(" ");

  return (
    <div
      className={cn(colSpanClasses, rowSpanClasses, className)}
      data-priority={priority}
    >
      {children}
    </div>
  );
};

export { ResponsiveGrid, ResponsiveGridItem };
