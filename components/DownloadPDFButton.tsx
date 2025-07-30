"use client";

import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generateDashboardPDF } from "@/utils/pdf/generateDashboardPDF";
import { useToast } from "@/hooks/use-toast";

interface DownloadPDFButtonProps {
  reportRef: React.RefObject<HTMLDivElement>;
  platform: string;
  country: string | null;
  className?: string;
  disabled?: boolean;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  reportRef,
  platform,
  country,
  className = "",
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (disabled) {
      toast({
        title: "Wait for data to load",
        description: "Please wait for all data to finish loading before exporting to PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generateDashboardPDF(reportRef, {
        platform,
        country: country || undefined
      });
      toast({
        title: "PDF Generated",
        description: "Your dashboard PDF has been successfully generated.",
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Error Generating PDF",
        description: "An unexpected error occurred while generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || disabled}
      className={`
        w-full text-left flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors group
        text-slate-300 hover:text-white hover:bg-slate-800
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title="Export current report as PDF"
    >
      {isGenerating ? (
        <Loader2 className="animate-spin flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
      ) : (
        <FileDown className="flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
      )}
      <span className="font-medium text-sm lg:text-base">
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </span>
    </button>
  );
};

export default DownloadPDFButton;
