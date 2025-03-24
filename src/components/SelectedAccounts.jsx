import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HouseIcon, User, X, PiggyBankIcon, DollarSign, Banknote, TrendingUp } from 'lucide-react';

export const SelectedAccounts = ({ accounts, onRemoveAccount }) => {
  const groupedAccounts = Array.from(accounts.values()).reduce((acc, account) => {
    if (!acc[account.householdId]) {
      acc[account.householdId] = {
        householdName: account.householdName || `Household ${account.householdId}`,
        accounts: []
      };
    }
    acc[account.householdId].accounts.push(account);
    return acc;
  }, {});

  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">
          Selected Accounts <span className="text-gray-500 font-normal text-sm">({accounts.size} accounts)</span>
        </h3>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {Object.entries(groupedAccounts).map(([householdId, { householdName, accounts }]) => (
            <div key={householdId} className="p-4">
              <div className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                <HouseIcon size={16} className="text-blue-600" />
                {householdName}
              </div>
              {accounts.map(account => (
                <div 
                  key={account.id} 
                  className="ml-6 flex justify-between items-center p-2 rounded-md"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {account.name} <span className="text-gray-400 text-sm">({account.id})</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <DollarSign size={12} className="text-green-500" />
                      Cash: ${account.cash_balance.toFixed(2)} 
                      <Banknote size={12} className="text-blue-500" />
                      Reserve Level: ${account.reserve_level.toFixed(2)} 
                      <PiggyBankIcon size={12} className="text-red-500 ml-2" />
                      {account.custodian}
                      <TrendingUp size={12} className="text-purple-500 ml-2" />
                      {account.model}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAccount(account.id)}
                    className="text-gray-400 hover:text-gray-700 p-1 h-8 w-8"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};