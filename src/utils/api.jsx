// api.js
// Mock data for development
const mockAccounts = [
    {
      householdId: 1,
      householdName: "Smith Family",
      accounts: [
        { id: 1, name: "John Smith IRA", balance: 450000 },
        { id: 2, name: "Mary Smith 401k", balance: 380000 }
      ]
    },
    {
      householdId: 2,
      householdName: "Johnson Family",
      accounts: [
        { id: 3, name: "Bob Johnson Roth", balance: 220000 },
        { id: 4, name: "Sarah Johnson Trust", balance: 890000 }
      ]
    }
  ];
  
  export const searchAccounts = async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAccounts.flatMap(household => {
      const matchingAccounts = household.accounts.filter(account =>
        account.name.toLowerCase().includes(query)
      );
      
      if (matchingAccounts.length > 0) {
        return matchingAccounts.map(account => ({
          ...account,
          householdName: household.householdName,
          householdId: household.householdId
        }));
      }
      
      if (household.householdName.toLowerCase().includes(query)) {
        return household.accounts.map(account => ({
          ...account,
          householdName: household.householdName,
          householdId: household.householdId
        }));
      }
      
      return [];
    });
  };
  
  export const mockRebalanceResponse = async (accountIds) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return accountIds.map(id => ({
      accountId: id,
      beforeTrades: {
        equities: 65,
        bonds: 35,
        cash: 0
      },
      afterTrades: {
        equities: 60,
        bonds: 40,
        cash: 0
      },
      proposedTrades: [
        { security: "VTI", action: "SELL", shares: 50, estimatedValue: 10000 },
        { security: "BND", action: "BUY", shares: 95, estimatedValue: 10000 }
      ]
    }));
  };