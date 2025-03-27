import React, { useState, useEffect } from 'react';
import { SearchSection } from './components/SearchSection';
import { SelectedAccounts } from './components/SelectedAccounts';
import { LoadingButton } from './components/LoadingButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchAccounts, rebalanceAccounts, startUp} from './utils/api';
import { Loader2 } from 'lucide-react';
import './index.css';

export default function App() {
  const [isStartUp, setIsStartup] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState(new Map());
  const [error, setError] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await startUp();
        setIsStartup(false);
      } catch {
        setError('Failed to load the necessary data. Please try again.');
        console.error("Error starting up the application: ", error);
      }
    };

    loadData();
}, [])

  useEffect(() => {
    if (!isStartUp) {
    const fetchAccounts = async () => {
      try {
        const data = await searchAccounts();
        console.log(data);
        setAccountsData(data);
      } catch (error) {
        setError("Failed to fetch accounts. Please try again.");
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
    }
  }, [isStartUp]);

  const handleAccountSelection = (account) => {
    setSelectedAccounts(new Map(selectedAccounts.set(account.id, account)));
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

  if (isStartUp) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl font-semibold text-gray-700">
          Fetching account data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-24 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.png" alt="Fountainhead Asset Management" className="h-12 w-auto" />
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Our Philosophy</a>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">What You Gain</a>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Meet Your Team</a>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Insights</a>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Contact Us</a>
            </nav>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> 
        <div className="bg-white rounded-lg shadow-sm border border-gray-200"> 
          <div className="p-10"> 
            <h1 className="text-2xl font-medium text-gray-800 mb-4">Portfolio Rebalancing</h1> 
            
            {/* Search Section */}
            <div className="mb-8"> 
              <SearchSection
                onSelectAccount={handleAccountSelection}
                accountsData={accountsData}
              />
            </div>

            {/* Selected Accounts */}
            {selectedAccounts.size > 0 && (
              <div className="mt-5 mb-8">
                <SelectedAccounts
                  accounts={selectedAccounts}
                  onRemoveAccount={removeAccount}
                />
              </div>
            )}

            {/* Rebalance Button */}
            <div className="mt-10 mb-4">
              <LoadingButton
                onClick={handleRebalance}
                disabled={selectedAccounts.size === 0}
                isLoading={isLoading}
              />
            </div>

            {/* Error and Success Alerts */}
            <div className="mt-8"> 
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
        </div>
      </main>
    </div>
  )
};
