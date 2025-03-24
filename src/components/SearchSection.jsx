import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, AlertTriangle, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SearchSection = ({ onSelectAccount, accountsData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]); // Track selected accounts
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  const flattenedAccounts = React.useMemo(() => {
    return accountsData.flatMap(household => {
      return household.accounts.map(account => ({
        ...account,
        householdId: household.householdId,
        householdName: `Household ${household.householdId}`
      }));
    });
  }, [accountsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
        setSelectedAccounts([]); 
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  
    if (query.length < 2) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }
  
    setIsSearching(true);
    setIsResultsVisible(true);
    setSearchError(null);
  
    searchTimeout.current = setTimeout(() => {
      try {
        const filteredResults = flattenedAccounts.filter((account) => {
          if (!account.name) {
            console.warn("Invalid account data:", account);
            return false;
          }
  
          const nameMatch = account.name.toLowerCase().startsWith(query.toLowerCase());
          const householdMatch = account.householdId.toString().toLowerCase().startsWith(query.toLowerCase());
          const idMatch = account.id.toString().toLowerCase().startsWith(query.toLowerCase());
  
          return nameMatch || householdMatch || idMatch;
        });
  
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchError("Failed to retrieve results. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setIsResultsVisible(true);
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccounts(prevSelected => {
      if (prevSelected.some(a => a.id === account.id)) {
        return prevSelected.filter(a => a.id !== account.id); 
      }
      return [...prevSelected, account]; 
    });
  };

  const handleHouseholdSelect = (householdAccounts) => {
    setSelectedAccounts(prevSelected => {
      const allAccountsSelected = householdAccounts.every(account =>
        prevSelected.some(a => a.id === account.id)
      );

      if (allAccountsSelected) {
        return prevSelected.filter(a => !householdAccounts.some(account => account.id === a.id));
      } else {
        const newSelected = householdAccounts.filter(account =>
          !prevSelected.some(a => a.id === account.id)
        );
        return [...prevSelected, ...newSelected];
      }
    });
  };

  const handleAddSelected = () => {
    selectedAccounts.forEach(account => {
      onSelectAccount(account); 
    });
    setSelectedAccounts([]); 
    setIsResultsVisible(false); 
    setSearchQuery('');
  };

  const groupedResults = searchResults.reduce((acc, account) => {
    if (!acc[account.householdId]) {
      acc[account.householdId] = {
        householdId: account.householdId,
        householdName: account.householdName || `Household ${account.householdId}`,
        accounts: []
      };
    }
    acc[account.householdId].accounts.push(account);
    return acc;
  }, {});

  return (
    <div className="relative mb-8" ref={searchRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          value={searchQuery}
          placeholder="Search accounts or households..."
          onChange={handleSearch}
          onFocus={handleFocus}
          className="pl-10 py-2 border border-gray-300 rounded-md bg-white focus:ring-grey-500 focus:border-grey-500 flex-grow"
        />
        {selectedAccounts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddSelected}
            className="text-gray-400 hover:text-gray-700 ml-2 h-8 w-8"
          >
            <Plus size={18} />
          </Button>
        )}
      </div>
      
      {isResultsVisible && (
        <Card className="absolute w-full z-50 mt-1 border border-gray-200 shadow-lg overflow-hidden bg-white">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : searchError ? (
            <div className="p-4 text-center text-red-500 flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              <span>{searchError}</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="h-64 overflow-y-auto">
              <CardContent className="p-0">
                {Object.values(groupedResults).map((household) => {
                  const allAccountsSelected = household.accounts.every(account =>
                    selectedAccounts.some(a => a.id === account.id)
                  );
                  return (
                    <div key={household.householdId} className="border-b last:border-b-0 border-gray-100">
                      <div
                        className="font-medium p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                        onClick={() => handleHouseholdSelect(household.accounts)}
                      >
                        <span className="text-gray-700">
                          {household.householdName} <span className="text-sm font-normal text-gray-500">(Select All)</span>
                        </span>
                      </div>
                      {household.accounts.map(account => (
                        <div
                          key={account.id}
                          className="p-3 pl-6 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                          onClick={() => handleAccountSelect(account)}
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-700">
                              {account.name} 
                              <span className="text-gray-500 text-sm ml-2">({account.id})</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Rep: {account.representative} | 
                              Custodian: {account.custodian} | 
                              Model: {account.model}
                            </span>
                          </div>
                          {selectedAccounts.some(a => a.id === account.id) && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </CardContent>
            </ScrollArea>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No accounts or households found.
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
};