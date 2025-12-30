"use client";

import React from "react";
import { X } from "lucide-react";
import DownloadPDFButton from "./DownloadPDFButton";
import DownloadCSVButton from "./DownloadCSVButton";

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportRef: React.RefObject<HTMLDivElement>;
  platform: string;
  country: string | null;
  disabled?: boolean;
}

const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  reportRef,
  platform,
  country,
  disabled,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-900 border border-border rounded-lg p-6 w-full max-w-sm m-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Download Report</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-text-muted mb-6">
          Select the format for your report.
        </p>
        <div className="space-y-3">
          <div className="w-full border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <DownloadPDFButton
              reportRef={reportRef}
              platform={platform}
              country={country}
              disabled={disabled}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent"
            />
          </div>
          <div className="w-full border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <DownloadCSVButton
              platform={platform}
              country={country}
              useBackend={true}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleReportModal;
