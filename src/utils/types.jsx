// types.js
/**
 * @typedef {Object} Account
 * @property {number} id
 * @property {string} name
 * @property {number} balance
 * @property {string} householdName
 * @property {number} householdId
 */

/**
 * @typedef {Object} Trade
 * @property {string} security
 * @property {string} action
 * @property {number} shares
 * @property {number} estimatedValue
 */

/**
 * @typedef {Object} Allocation
 * @property {number} equities
 * @property {number} bonds
 * @property {number} cash
 */

/**
 * @typedef {Object} RebalanceResult
 * @property {number} accountId
 * @property {Allocation} beforeTrades
 * @property {Allocation} afterTrades
 * @property {Trade[]} proposedTrades
 */
