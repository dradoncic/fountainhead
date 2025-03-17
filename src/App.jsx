import React, { useState, useEffect } from 'react';
import { SearchSection } from './components/SearchSection';
import { SelectedAccounts } from './components/SelectedAccounts';
import { LoadingButton } from './components/LoadingButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchAccounts, rebalanceAccounts } from './utils/api';
import './index.css';

export default function App() {
  const [selectedAccounts, setSelectedAccounts] = useState(new Map());
  const [error, setError] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await searchAccounts();
        setAccountsData(data);
      } catch (error) {
        setError("Failed to fetch accounts. Please try again.");
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

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
    const accountsList = Array.from(selectedAccounts.values()).map(account => ({
      id: account.id,
      name: account.name,
      householdId: account.householdId,
    }));

    if (accountsList.length === 0) {
      setError("Please select at least one account for rebalancing.");
      setTimeout(() => setError(null), 2000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await rebalanceAccounts(accountsList);
      console.log("Backend response:", data);
      setSuccess("Rebalance preview request sent successfully!");
      setTimeout(() => setSuccess(null), 2000); 
    } catch (error) {
      setError("Failed to send rebalance request.");
      setTimeout(() => setError(null), 2000); 
      console.error("Error sending rebalance request:", error);
    } finally {
      setIsLoading(false);
    }
    setSelectedAccounts(new Map());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-xl">
      {/* Logo Section */}
      <div className="flex justify-between items-center mb-6">
        <img src="/logo.png" alt="Logo" className="w-24 h-auto" />
        <h1 className="text-3xl font-semibold text-gray-800">Portfolio Rebalancing</h1>
      </div>
      
      {/* Search Section */}
      <SearchSection
        onSelectAccount={handleAccountSelection}
        onSelectHousehold={handleHouseholdSelection}
        accountsData={accountsData}
      />

      {/* Selected Accounts */}
      {selectedAccounts.size > 0 && (
        <div className="mt-6">
          <SelectedAccounts
            accounts={selectedAccounts}
            onRemoveAccount={removeAccount}
          />
        </div>
      )}

      {/* Rebalance Button */}
      <div className="mt-6 flex justify-center">
        <LoadingButton
          onClick={handleRebalance}
          disabled={selectedAccounts.size === 0}
          isLoading={isLoading}
        />
      </div>

      {/* Error and Success Alerts */}
      <div className="mt-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
