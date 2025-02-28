import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart2 } from 'lucide-react';

export const LoadingButton = ({ onClick, disabled, isLoading }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mb-4 py-6 text-lg font-medium shadow-sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing Rebalance...
        </>
      ) : (
        <>
          <BarChart2 className="mr-2 h-5 w-5" />
          Generate Rebalance Preview
        </>
      )}
    </Button>
  );
};