import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, User, X } from 'lucide-react';

export const SelectedAccounts = ({ accounts, onRemoveAccount }) => {
  const groupedAccounts = Array.from(accounts.values()).reduce((acc, account) => {
    if (!acc[account.householdId]) {
      acc[account.householdId] = {
        householdName: account.householdName,
        accounts: []
      };
    }
    acc[account.householdId].accounts.push(account);
    return acc;
  }, {});

  return (
    <Card className="mb-8 border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="font-semibold">
          Selected for Rebalancing <span className="text-gray-500 font-normal">({accounts.size} accounts)</span>
        </h3>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          {Object.entries(groupedAccounts).map(([householdId, { householdName, accounts }]) => (
            <div key={householdId} className="mb-4">
              <div className="font-medium mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-gray-500" />
                {householdName}
              </div>
              {accounts.map(account => (
                <div 
                  key={account.id} 
                  className="ml-6 flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span>{account.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">${account.balance.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAccount(account.id)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};