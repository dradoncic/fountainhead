// RebalanceResults.js
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const RebalanceResults = ({ results, selectedAccounts }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Rebalance Preview</h2>
      {results.map(result => (
        <Card key={result.accountId}>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">
              {Array.from(selectedAccounts.values())
                .find(a => a.id === result.accountId)?.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Current Allocation</h4>
                <div>Equities: {result.beforeTrades.equities}%</div>
                <div>Bonds: {result.beforeTrades.bonds}%</div>
                <div>Cash: {result.beforeTrades.cash}%</div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Target Allocation</h4>
                <div>Equities: {result.afterTrades.equities}%</div>
                <div>Bonds: {result.afterTrades.bonds}%</div>
                <div>Cash: {result.afterTrades.cash}%</div>
              </div>
            </div>

            <h4 className="font-medium mb-2">Proposed Trades</h4>
            <div className="space-y-2">
              {result.proposedTrades.map((trade, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {trade.action} {trade.shares} shares of {trade.security}
                  </span>
                  <span>${trade.estimatedValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};