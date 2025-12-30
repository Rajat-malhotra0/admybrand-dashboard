"use client";

import { useState, useEffect } from "react";

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface ScreenBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
}

const breakpoints: ScreenBreakpoints = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const updateSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      setWidth(windowWidth);
      setHeight(windowHeight);

      // Determine current screen size
      if (windowWidth >= breakpoints["3xl"]) {
        setScreenSize("3xl");
      } else if (windowWidth >= breakpoints["2xl"]) {
        setScreenSize("2xl");
      } else if (windowWidth >= breakpoints.xl) {
        setScreenSize("xl");
      } else if (windowWidth >= breakpoints.lg) {
        setScreenSize("lg");
      } else if (windowWidth >= breakpoints.md) {
        setScreenSize("md");
      } else if (windowWidth >= breakpoints.sm) {
        setScreenSize("sm");
      } else {
        setScreenSize("xs");
      }
    };

    // Set initial size
    updateSize();

    // Add event listener
    window.addEventListener("resize", updateSize);

    // Cleanup
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Helper functions
  const isMobile = screenSize === "xs" || screenSize === "sm";
  const isTablet = screenSize === "md";
  const isDesktop = screenSize === "lg" || screenSize === "xl" || screenSize === "2xl" || screenSize === "3xl";
  const isSmallScreen = screenSize === "xs" || screenSize === "sm" || screenSize === "md";
  const isLargeScreen = screenSize === "xl" || screenSize === "2xl" || screenSize === "3xl";

  // Check if screen size is at least a certain breakpoint
  const isAtLeast = (breakpoint: ScreenSize): boolean => {
    const currentIndex = Object.keys(breakpoints).indexOf(screenSize);
    const targetIndex = Object.keys(breakpoints).indexOf(breakpoint);
    return currentIndex >= targetIndex;
  };

  // Check if screen size is at most a certain breakpoint
  const isAtMost = (breakpoint: ScreenSize): boolean => {
    const currentIndex = Object.keys(breakpoints).indexOf(screenSize);
    const targetIndex = Object.keys(breakpoints).indexOf(breakpoint);
    return currentIndex <= targetIndex;
  };

  return {
    screenSize,
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    isAtLeast,
    isAtMost,
    breakpoints,
  };
};
