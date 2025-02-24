// LoadingButton.js
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const LoadingButton = ({ onClick, disabled, isLoading }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mb-4"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Generate Rebalance Preview'
      )}
    </Button>
  );
};