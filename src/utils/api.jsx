// api.js

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5000';

/**
 * Creates API request options with appropriate headers
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} [body] - Request body for POST/PUT requests
 * @returns {Object} Request options object
 */
const createRequestOptions = (method, body = null) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = body;
  }

  return options;
};

/**
 * Handles API responses and errors consistently
 * @param {Response} response - Fetch API response object
 * @returns {Promise} Resolved with JSON data or rejected with error
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Fetches accounts from the server
 * @returns {Promise<Object>} JSON response from the server
 */
export const searchAccounts = async () => {
  try {
    const url = new URL(`${API_BASE_URL}/filterOptions/households`);
    
    const response = await fetch(url.toString(), createRequestOptions('GET'));
    const data = await handleResponse(response);
    
    return data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw new Error(`Failed to fetch accounts: ${error.message}`);
  }
};

/**
 * Rebalances accounts by sending them to the backend
 * @param {Array} accountList - List of accounts to rebalance
 * @returns {Promise<Object>} JSON response from the server
 */
export const rebalanceAccounts = async (accountList) => {
  try {
    const url = new URL(`${API_BASE_URL}/rebalance`);

    const response = await fetch(url.toString(), createRequestOptions('POST', JSON.stringify({accounts: accountList})));
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error sending rebalance request:', error);
    throw new Error(`Failed to send rebalance request: ${error.message}`);
  }
};
