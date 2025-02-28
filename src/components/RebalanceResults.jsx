import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

export const RebalanceResults = ({ results, selectedAccounts }) => {
  return (
    <div className="space-y-6 mt-8 pb-12">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold">Rebalance Preview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map(result => {
          const account = Array.from(selectedAccounts.values())
            .find(a => a.id === result.accountId);
          
          return (
            <Card key={result.accountId} className="overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg">{account?.name}</h3>
                <p className="text-sm text-gray-500">${account?.balance.toLocaleString()}</p>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-gray-700">Current Allocation</h4>
                    <div className="space-y-2">
                      <AllocationBar label="Equities" value={result.beforeTrades.equities} />
                      <AllocationBar label="Bonds" value={result.beforeTrades.bonds} />
                      <AllocationBar label="Cash" value={result.beforeTrades.cash} />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-gray-700">Target Allocation</h4>
                    <div className="space-y-2">
                      <AllocationBar label="Equities" value={result.afterTrades.equities} />
                      <AllocationBar label="Bonds" value={result.afterTrades.bonds} />
                      <AllocationBar label="Cash" value={result.afterTrades.cash} />
                    </div>
                  </div>
                </div>

                <h4 className="font-medium mb-3 text-gray-700">Proposed Trades</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {result.proposedTrades.map((trade, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {trade.action === "BUY" ? (
                          <TrendingUp size={18} className="text-green-500" />
                        ) : (
                          <TrendingDown size={18} className="text-red-500" />
                        )}
                        <span className="font-medium">
                          {trade.action} {trade.shares} shares of {trade.security}
                        </span>
                      </div>
                      <span className={`font-medium ${trade.action === "BUY" ? "text-green-600" : "text-red-600"}`}>
                        ${trade.estimatedValue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const AllocationBar = ({ label, value }) => {
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            label === "Equities" ? "bg-blue-500" : 
            label === "Bonds" ? "bg-purple-500" : "bg-green-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};