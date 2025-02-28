import React, { useState } from 'react';
import { SearchSection } from './components/SearchSection';
import { SelectedAccounts } from './components/SelectedAccounts';
import { RebalanceResults } from './components/RebalanceResults';
import { LoadingButton } from './components/LoadingButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { mockRebalanceResponse } from './utils/api';
import './index.css';

export default function App() {
  const [selectedAccounts, setSelectedAccounts] = useState(new Map());
  const [rebalanceResults, setRebalanceResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccountSelection = (account) => {
    setSelectedAccounts(new Map(selectedAccounts.set(account.id, account)));
  };

  const handleHouseholdSelection = (householdAccounts) => {
    const newSelected = new Map(selectedAccounts);
    householdAccounts.forEach(account => {
      newSelected.set(account.id, account);
    });
    setSelectedAccounts(newSelected);
  };

  const removeAccount = (accountId) => {
    const newSelected = new Map(selectedAccounts);
    newSelected.delete(accountId);
    setSelectedAccounts(newSelected);
  };

  const handleRebalance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await mockRebalanceResponse(Array.from(selectedAccounts.keys()));
      setRebalanceResults(results);
    } catch (err) {
      setError('Failed to process rebalance request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearRebalanceResults = () => {
    setRebalanceResults(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Rebalancing</h1>
        {rebalanceResults && (
          <Button 
            variant="ghost" 
            onClick={clearRebalanceResults}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Clear Results
          </Button>
        )}
      </div>
      
      <SearchSection
        onSelectAccount={handleAccountSelection}
        onSelectHousehold={handleHouseholdSelection}
      />

      {selectedAccounts.size > 0 && (
        <SelectedAccounts
          accounts={selectedAccounts}
          onRemoveAccount={removeAccount}
        />
      )}

      <div className="relative z-0 mt-6">
        <LoadingButton
          onClick={handleRebalance}
          disabled={selectedAccounts.size === 0 || isLoading}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {rebalanceResults && (
        <RebalanceResults
          results={rebalanceResults}
          selectedAccounts={selectedAccounts}
        />
      )}
    </div>
  );
}