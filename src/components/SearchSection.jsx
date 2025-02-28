import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search } from 'lucide-react';
import { searchAccounts } from '../utils/api';

export const SearchSection = ({ onSelectAccount, onSelectHousehold }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    setIsSearching(true);
    setIsResultsVisible(true);
    
    try {
      const results = await searchAccounts(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setIsResultsVisible(true);
    }
  };

  return (
    <div className="relative mb-12" ref={searchRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          value={searchQuery}
          placeholder="Search accounts or households..."
          onChange={handleSearch}
          onFocus={handleFocus}
          className="pl-10 bg-white shadow-sm border-gray-200"
        />
      </div>
      
      {isResultsVisible && (
        <Card className="absolute w-full z-50 mt-1 border-gray-200 shadow-lg overflow-hidden">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="max-h-64">
              <CardContent className="p-0">
                {Object.entries(
                  searchResults.reduce((acc, account) => {
                    if (!acc[account.householdId]) {
                      acc[account.householdId] = {
                        householdName: account.householdName,
                        accounts: []
                      };
                    }
                    acc[account.householdId].accounts.push(account);
                    return acc;
                  }, {})
                ).map(([householdId, { householdName, accounts }]) => (
                  <div key={householdId} className="border-b last:border-b-0 border-gray-100">
                    <div 
                      className="font-semibold p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onSelectHousehold(accounts);
                        setSearchQuery('');
                        setIsResultsVisible(false);
                        setSearchResults([]);
                      }}
                    >
                      {householdName} <span className="text-sm font-normal text-gray-500">(Select All)</span>
                    </div>
                    {accounts.map(account => (
                      <div
                        key={account.id}
                        className="ml-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                        onClick={() => {
                          onSelectAccount(account);
                          setSearchQuery('');
                          setIsResultsVisible(false);
                          setSearchResults([]);
                        }}
                      >
                        <span>{account.name}</span>
                        <span className="text-sm text-gray-500">
                          ${account.balance.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No accounts or households found
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
};