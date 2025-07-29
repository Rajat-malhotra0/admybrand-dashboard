import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: any;
  onRetry?: () => void;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong' 
}) => {
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-sm text-red-600 text-center mb-4 max-w-md">
        {getErrorMessage(error)}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
