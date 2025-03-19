import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

export const LoadingButton = ({ onClick, disabled, isLoading }) => {
  // Only render the button if it's not disabled
  if (disabled) {
    return null; // Return nothing if the button is disabled
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 text-base font-medium transition-colors ${
        disabled
          ? 'bg-blue-600 text-white cursor-wait' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          <BarChart2 className="mr-2 h-5 w-5" />
          Generate Rebalance Preview
        </>
      )}
    </Button>
  );
};