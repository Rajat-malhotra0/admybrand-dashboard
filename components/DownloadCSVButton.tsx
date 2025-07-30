"use client";

import React from "react";
import { Download, FileDown } from "lucide-react";
import { usePlatformData } from "@/hooks/usePlatformData";
import { useCountriesWithData } from "@/hooks/useCountriesWithData";

interface DownloadCSVButtonProps {
  platform?: string;
  country?: string | null;
  disabled?: boolean;
  useBackend?: boolean;
  className?: string;
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({
  platform = "LinkedIn",
  country,
  disabled = false,
  useBackend = true,
  className = "",
}) => {
  const { data: platformData, isLoading: platformLoading } = usePlatformData(
    platform,
    useBackend,
    country
  );
  const { countries: countriesWithData, isLoading: countriesLoading } = useCountriesWithData();

  const convertToCSV = (data: any[], headers: string[]): string => {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '_')] || row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const downloadCSV = () => {
    if (!platformData) return;

    try {
      let csvContent = '';
      const timestamp = new Date().toISOString().split('T')[0];
      const countryLabel = country ? `_${country}` : '_Global';
      
      // Add metadata header
      csvContent += `Dashboard Export - ${platform}${countryLabel}\n`;
      csvContent += `Export Date: ${new Date().toLocaleDateString()}\n`;
      csvContent += `Export Time: ${new Date().toLocaleTimeString()}\n\n`;

      // Add available countries
      if (countriesWithData && countriesWithData.length > 0) {
        csvContent += 'Available Countries\n';
        csvContent += countriesWithData.join(',') + '\n\n';
      }

      // Campaign Stats
      if (platformData.campaignStats && platformData.campaignStats.length > 0) {
        csvContent += 'Campaign Statistics\n';
        const statsHeaders = ['Title', 'Value', 'Description', 'Icon'];
        csvContent += convertToCSV(platformData.campaignStats, statsHeaders) + '\n\n';
      }

      // Influencers Data
      if (platformData.influencerData && platformData.influencerData.length > 0) {
        csvContent += 'Influencer Data\n';
        const influencerHeaders = ['ID', 'Name', 'Projects', 'Followers', 'Platform', 'Country'];
        const influencerDataWithMeta = platformData.influencerData.map((inf: any) => ({
          ...inf,
          platform: platform,
          country: country || 'Global'
        }));
        csvContent += convertToCSV(influencerDataWithMeta, influencerHeaders) + '\n\n';
      }

      // Demographics Data
      if (platformData.demographicsData && platformData.demographicsData.length > 0) {
        csvContent += 'Demographics Data\n';
        const demoHeaders = ['Label', 'Male', 'Female', 'Total'];
        const demoDataWithTotal = platformData.demographicsData.map((demo: any) => ({
          ...demo,
          total: demo.male + demo.female
        }));
        csvContent += convertToCSV(demoDataWithTotal, demoHeaders) + '\n\n';
      }

      // Interests Data
      if (platformData.interestsData && platformData.interestsData.length > 0) {
        csvContent += 'Interests Data\n';
        const interestHeaders = ['Label', 'Value', 'Percentage'];
        const interestDataWithPercentage = platformData.interestsData.map((interest: any) => ({
          ...interest,
          percentage: `${interest.value}%`
        }));
        csvContent += convertToCSV(interestDataWithPercentage, interestHeaders) + '\n\n';
      }

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `dashboard_export_${platform}${countryLabel}_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV file. Please try again.');
    }
  };

  const isLoading = platformLoading || countriesLoading;
  const isDisabled = disabled || isLoading || !platformData;

  return (
    <button
      onClick={downloadCSV}
      disabled={isDisabled}
      className={className || `
        w-full text-left flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors group
        ${
          isDisabled
            ? "text-slate-500 cursor-not-allowed"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }
      `}
      title={isDisabled 
        ? (isLoading ? "Loading data..." : "No data available for export") 
        : "Download dashboard data as CSV"
      }
    >
      <FileDown className="flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
      <span className="font-medium text-sm lg:text-base">
        {isLoading ? "Loading..." : "Download CSV"}
      </span>
      {isLoading && (
        <div className="ml-auto w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

export default DownloadCSVButton;
