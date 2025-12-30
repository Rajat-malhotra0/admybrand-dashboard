import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimpleMapChartProps {
  onCountryClick?: (countryIsoCode: string) => void;
  countriesWithData?: string[];
}

const SimpleMapChart: React.FC<SimpleMapChartProps> = ({
  onCountryClick,
  countriesWithData = [],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">Geographic Reach</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-border/50">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-text-muted text-sm font-medium">Loading world map data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">Geographic Reach</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-dashed border-red-200 dark:border-red-800">
          <div className="text-center text-red-500">
            <p className="mb-3 font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-red-50 border-red-200 text-red-600"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">Geographic Reach</h2>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-xs text-text-muted font-medium">Active Regions</span>
        </div>
      </div>
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border/50 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="text-center relative z-10">
          <div className="bg-white dark:bg-slate-800 border border-border/50 shadow-sm rounded-2xl w-64 h-64 mx-auto flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
             {/* Placeholder for actual map component */}
             <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                   <div className="w-16 h-16 bg-primary/20 rounded-full"></div>
                </div>
             </div>
          </div>
          <p className="text-text-muted font-medium mb-2">
            Interactive World Map
          </p>
          <p className="text-xs text-text-muted/70 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full inline-block border border-border/50">
            {countriesWithData.length > 0 ? `${countriesWithData.length} Countries Active` : "No Active Regions"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SimpleMapChart;
