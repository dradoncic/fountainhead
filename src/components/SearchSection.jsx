// SearchSection.js
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { searchAccounts } from '../utils/api';

export const SearchSection = ({ onSelectAccount, onSelectHousehold }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAccounts(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative mb-8">
      <Input
        type="text"
        value={searchQuery}
        placeholder="Search accounts or households..."
        onChange={handleSearch}
        className="mb-2"
      />
      
      {isSearching && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      
      {searchResults.length > 0 && (
        <Card className="absolute w-full z-10">
          <ScrollArea className="max-h-64">
            <CardContent className="p-2">
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
                <div key={householdId} className="mb-2">
                  <div 
                    className="font-semibold p-2 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => {
                      onSelectHousehold(accounts);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    {householdName} (Select All)
                  </div>
                  {accounts.map(account => (
                    <div
                      key={account.id}
                      className="ml-4 p-2 hover:bg-gray-100 cursor-pointer rounded flex justify-between items-center"
                      onClick={() => {
                        onSelectAccount(account);
                        setSearchQuery('');
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
        </Card>
      )}
    </div>
  );
};