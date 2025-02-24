// SelectedAccounts.js
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">
          Selected for Rebalancing ({accounts.size} accounts)
        </h3>
        <div className="space-y-2">
          {Object.entries(groupedAccounts).map(([householdId, { householdName, accounts }]) => (
            <div key={householdId} className="mb-4">
              <div className="font-medium mb-2">{householdName}</div>
              {accounts.map(account => (
                <div key={account.id} className="ml-4 flex justify-between items-center">
                  <span>{account.name}</span>
                  <div className="flex items-center gap-4">
                    <span>${account.balance.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAccount(account.id)}
                    >
                      <X className="h-4 w-4" />
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