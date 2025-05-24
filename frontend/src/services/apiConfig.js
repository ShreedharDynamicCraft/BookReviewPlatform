/**
 * API Configuration Service
 * Centralizes API base URL configuration and provides utility methods for API calls
 */

// Get API base URL from environment variable or use the deployed Vercel URL as default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://book-review-platform-wnr7.vercel.app/api';

console.log('API Base URL:', API_BASE_URL);

/**
 * Formats API URLs consistently
 * @param {String} endpoint - API endpoint without leading slash
 * @returns {String} - Complete URL
 */
export const getApiUrl = (endpoint) => {
  // Remove any leading slash from the endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Sends a request to the API with proper headers and error handling
 * @param {String} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {String} token - Authentication token (optional)
 * @returns {Promise<Object>} - Response data
 */
export const apiRequest = async (endpoint, options = {}, token = null) => {
  const url = getApiUrl(endpoint);
  
  console.log(`Making API request to: ${url}`);
  
  // Get token from options or from the provided token parameter
  const authToken = options.token || token || (localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')).token : null);
  
  // Set up headers with authentication if token is provided
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log(`Response status from ${url}: ${response.status}`);
    console.log(`Response content-type: ${response.headers.get('content-type')}`);
    
    // For better debugging, log a preview of the response body
    const responseClone = response.clone();
    try {
      const responsePreview = await responseClone.text();
      console.log(`Response preview (first 200 chars): ${responsePreview.substring(0, 200)}`);
    } catch (err) {
      console.log('Could not preview response body');
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        return data;
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse JSON response: ${jsonError.message}`);
      }
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`API request failed: ${text}`);
      }
      
      return { message: text };
    }
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
};

export default {
  getApiUrl,
  apiRequest,
  API_BASE_URL
};
